
const csv = require('csv-parser');
const { Readable } = require('stream');
const ImportedRegistration = require('../repository/user/ImportedRegistration');


const parseCSV = (csvText) => {
    return new Promise((resolve, reject) => {
        const rows = [];

        Readable.from([csvText])
            .pipe(csv({
                mapHeaders: ({ header }) =>
                    header.replace(/^\uFEFF/, '').trim()
            }))
            .on('data', row => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
};

const ImportedRegistrationController = {
    async importCSV(req, res) {


        if (typeof req.body !== 'string' || !req.body.trim()) {
            return res.status(400).json({ message: 'Missing CSV data' });
        }

        try {
            const rows = await parseCSV(req.body);

            if (!rows.length) {
                return res.status(400).json({ message: 'CSV contains no registrations' });
            }

            const requiredHeaders = ['First Name', 'Last Name', 'Email'];
            const missingHeaders = requiredHeaders.filter(
                header => !Object.hasOwn(rows[0], header)
            );

            if (missingHeaders.length) {
                return res.status(400).json({
                    message: `Missing CSV columns: ${missingHeaders.join(', ')}`
                });
            }

            let imported = 0;
            let skipped = 0;
            const errors = [];

            for (const [index, row] of rows.entries()) {
                const firstName = (row['First Name'] || '').trim();
                const lastName = (row['Last Name'] || '').trim();
                const email = (row['Email'] || '').trim().toLowerCase();

                if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    errors.push(`Row ${index + 2}: missing name or invalid email`);
                    skipped++;
                    continue;
                }

                const ageText = (row['Age'] || '').trim();
                const age = ageText === '' ? null : Number(ageText);

                if (age !== null && (!Number.isInteger(age) || age < 1 || age > 120)) {
                    errors.push(`Row ${index + 2}: invalid age`);
                    skipped++;
                    continue;
                }

                const checkedIn = (row['Checked In?'] || '').trim().toLowerCase();

                const registration = {
                    firstName,
                    lastName,
                    email,
                    age,
                    phoneNumber: row['Phone Number'] || null,
                    school: row['School'] || null,
                    tShirtSize: row['T-Shirt Size'] || null,
                    dietaryRestrictions: row['Dietary Restrictions'] || null,
                    checkIn: ['yes', 'true', '1'].includes(checkedIn),
                    formData: row
                };

                try {
                    const [, created] = await ImportedRegistration.findOrCreate({
                        where: { email },
                        defaults: registration
                    });

                    if (created) {
                        imported++;
                    } else {
                        skipped++;
                    }
                } catch (error) {
                    skipped++;
                    errors.push(`Row ${index + 2}: could not save registration`);
                    console.error('CSV registration row error:', error);
                }
            }

            res.status(200).json({
                message: `Imported ${imported} registrations; skipped ${skipped}.`,
                imported,
                skipped,
                errors
            });
        } catch (error) {
            console.error('Registration CSV import failed:', error);
            res.status(500).json({ message: 'Failed to process registration CSV' });
        }
    },

    async getRegistrations(req, res) {


        try {
            const registrations = await ImportedRegistration.findAll({
                attributes: [
                    'id', 'firstName', 'lastName', 'age', 'email',
                    'phoneNumber', 'school', 'tShirtSize',
                    'dietaryRestrictions', 'checkIn'
                ]
            });

            res.json({
                data: registrations.map(registration => ({
                    ...registration.toJSON(),
                    id: `imported-${registration.id}`,
                    source: 'imported',
                    role: 'participant',
                    isBanned: false
                }))
            });
        } catch (error) {
            console.error('Fetching imported registrations failed:', error);
            res.status(500).json({ message: 'Failed to fetch registrations' });
        }
    }
};

module.exports = ImportedRegistrationController;
