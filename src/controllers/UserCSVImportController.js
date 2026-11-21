
const csv = require('csv-parser');
const { Readable } = require('stream');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { sequelize } = require('../repository/config/index');
const { User, EventParticipant } = require('../repository/config/Models');
const UserRepo = require('../repository/user/UserRepo');
const EventRepo = require('../repository/event/EventRepo');

const parseCSV = (csvText) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        let headers = [];

        Readable.from([csvText])
            .pipe(csv({
                mapHeaders: ({ header }) =>
                    header.replace(/^\uFEFF/, '').trim()
            }))
            .on('headers', values => { headers = values; })
            .on('data', row => rows.push(row))
            .on('end', () => resolve({ rows, headers }))
            .on('error', reject);
    });
};

const value = (row, key) => String(row[key] || '').trim();

const accepted = (input) => {
    const text = String(input || '').trim().toLowerCase();
    return ['yes', 'true', '1', 'agree', 'i agree', 'accepted'].includes(text)
        || /\bagree\b/.test(text);
};

const optionalInteger = (input, fallback = null) => {
    const text = String(input || '').trim();
    if (!text) return fallback;
    const number = Number(text);
    return Number.isInteger(number) && number >= 0 ? number : fallback;
};

const parseHackathonsAttended = (input) => {
    const text = String(input || '').trim();

    if (!text || /^(none|no|n\/a)$/i.test(text)) {
        return 0;
    }

    if (/^\d+$/.test(text)) {
        return Number(text);
    }

    // Unknown number of hackathons
    return null;
};

const parseGraduationYear = (input) => {
    const text = String(input || '').trim();

    if (/^\d{4}$/.test(text)) {
        return Number(text);
    }

    const semester = text.match(
        /^(spring|summer|fall|winter)\s+(\d{4})$/i
    );

    if (semester) {
        return Number(semester[2]);
    }

    return null;
};

const UserCSVImportController = {
    async importCSV(req, res) {
        if (typeof req.body !== 'string' || !req.body.trim()) {
            return res.status(400).json({ message: 'Missing CSV data' });
        }

        try {
            const activeEvent = await EventRepo.findActiveEvent();

            if (!activeEvent) {
                return res.status(409).json({
                    message: 'No active event available for registration'
                });
            }

            const { rows, headers } = await parseCSV(req.body);

            const requiredHeaders = [
                'First Name', 'Last Name', 'Email', 'Phone Number',
                'Age', 'Country of Residence', 'School',
                'T-Shirt Size', 'Level of Education',
                'MLH Code of Conduct'
            ];

            const privacyHeader = headers.find(header =>
                header.startsWith('MLH Privacy Policy')
            );

            const missing = requiredHeaders.filter(
                header => !headers.includes(header)
            );

            if (!privacyHeader) {
                missing.push('MLH Privacy Policy');
            }

            if (missing.length) {
                return res.status(400).json({
                    message: `Missing CSV columns: ${missing.join(', ')}`
                });
            }

            let createdUsers = 0;
            let enrolled = 0;
            let alreadyEnrolled = 0;
            const errors = [];

            for (const [index, row] of rows.entries()) {
                try {
                    const firstName = value(row, 'First Name');
                    const lastName = value(row, 'Last Name');
                    const email = value(row, 'Email').toLowerCase();
                    const phoneNumber = value(row, 'Phone Number');
                    const age = optionalInteger(value(row, 'Age'));
                    const country = value(row, 'Country of Residence');
                    const school = value(row, 'School');
                    const tShirtSize = value(row, 'T-Shirt Size');
                    const levelOfStudy = value(row, 'Level of Education');

                    if (!firstName || !lastName ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                        !phoneNumber || age === null || age < 1 ||
                        age > 120 || !country || !school ||
                        !tShirtSize || !levelOfStudy) {
                        throw new Error('Missing or invalid required user information');
                    }

                    const mlhCodeOfConduct = accepted(
                        value(row, 'MLH Code of Conduct')
                    );

                    const mlhPrivacyPolicy = accepted(
                        value(row, privacyHeader)
                    );

                    if (!mlhCodeOfConduct || !mlhPrivacyPolicy) {
                        throw new Error('Required MLH consent not provided');
                    }

                    const isBanned = await UserRepo.checkIfBanned({
                        firstName, lastName, email
                    });

                    if (isBanned) {
                        throw new Error('User is banned');
                    }

                    const result = await sequelize.transaction(async transaction => {
                        let user = await User.findOne({
                            where: { email },
                            transaction
                        });

                        let created = false;

                        if (!user) {
                            const randomPassword =
                                crypto.randomBytes(32).toString('hex');

                            const hashedPassword =
                                await bcrypt.hash(randomPassword, 10);

                            user = await User.create({
                                firstName,
                                lastName,
                                email,
                                password: hashedPassword,
                                role: 'participant',
                                phoneNumber,
                                age,
                                gender: value(row, 'Gender') || null,
                                country,
                                tShirtSize,
                                dietaryRestrictions:
                                    value(row, 'Dietary Restrictions') || null,
                                school,
                                major: null,
                                graduationYear: parseGraduationYear(
                                    value(row, 'Graduation Year')
                                ),
                                levelOfStudy,
                                hackathonsAttended: parseHackathonsAttended(
                                    value(row, 'Hackathons Attended')
                                ),
                                linkedInUrl: value(row, 'LinkedIn URL') || null,
                                pronouns: value(row, 'Pronouns') || null,
                                mlhCodeOfConduct,
                                mlhPrivacyPolicy,
                                mlhEmails: /^I authorize MLH \+ DEV to send me /i.test(
                                    value(row, 'MLH + DEV Emails')
                                ),
                                isEmailVerified: false
                            }, { transaction });

                            created = true;
                        }

                        if (user.isBanned) {
                            throw new Error('User is banned');
                        }

                        const [, enrollmentCreated] =
                            await EventParticipant.findOrCreate({
                                where: {
                                    userId: user.id,
                                    eventId: activeEvent.id
                                },
                                defaults: {
                                    teamId: null,
                                    checkIn: accepted(
                                        value(row, 'Checked In?')
                                    )
                                },
                                transaction
                            });

                        return { created, enrollmentCreated };
                    });

                    if (result.created) createdUsers++;

                    if (result.enrollmentCreated) {
                        enrolled++;
                    } else {
                        alreadyEnrolled++;
                    }

                } catch (error) {
                    errors.push({
                        row: index + 2,
                        reason: error.message
                    });
                }
            }

            return res.status(200).json({
                message: `Created ${createdUsers} users and enrolled ${enrolled} participants.`,
                createdUsers,
                enrolled,
                alreadyEnrolled,
                failed: errors.length,
                errors
            });

        } catch (error) {
            console.error('CSV user import failed:', error);

            return res.status(500).json({
                message: 'Failed to process user CSV'
            });
        }
    }
};

module.exports = UserCSVImportController;
