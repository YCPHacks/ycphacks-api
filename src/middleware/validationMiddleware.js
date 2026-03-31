const {check, validationResult} = require('express-validator');
const {isLength} = require("validator");
const UserRepo = require("../repository/user/UserRepo");
const checkBodyForSpecialCharacters = (req, res, next) => {
    // Fields we want to skip
    const ignoreFields = ["imageUrl", "password"]

    // Blocks characters often used in attacks ($, %, #, <, >, etc.)
    const generalRegex = /[^a-zA-Z0-9\s-',\.:/\?&_=()@]/;

    for (const key in req.body) {
        if (ignoreFields.includes(key)) continue; // Skip validation for fields we don't want to check
        const value = req.body[key];

        // Only check string values
        if (typeof value === 'string') {
            if (generalRegex.test(value)) {
                // If a restricted character is found, fail fast and return 400
                // console.warn(`Validation Failed: Field '${key}' contains restricted characters: ${value}`);
                return res.status(400).json({ 
                    error: "Invalid input",
                    message: `The input for '${key}' contains restricted characters ($ # @ % ^ ( ) + = !). Please remove them.`
                });
            }
        }
    }
    
    // If all checks pass, proceed to the controller
    next();
};

const userValidationRules = [
    // 1. Validate email
    check('email')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter an email.').bail()
        // Check if what was entered is a valid email
        .isEmail().withMessage('Your email is not valid.').bail()
        // Check if the email has already been registered
        .custom(async (value) => {
            const existingUser = await UserRepo.findByEmail(value)
            if (existingUser){
                throw new Error('Email has already been registered.')
            }
            return true;
}),

    // 2. Validate password
    check('password')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter a password.').bail()
        // Password is at least 8 characters, bail if it's not
        .isLength({min: 8}).withMessage('Password must be at least 8 characters.'),

    // 3. Validate firstName and Lastname
    check('firstName')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter a first name.').bail()
        // Check if the length is less than 50 characters, if not then bail
        .isLength({max: 50}).withMessage('Please enter a first name that is less than 50 characters.').bail()
        // Check if there are only letter
        .matches(/^[a-zA-Z\s]+$/).withMessage('Your first name may only contain letters.'),

    check('lastName')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter a last name.').bail()
        // Check if the length is less than 50 characters, if not then bail
        .isLength({max: 50}).withMessage('Please enter a last name that is less than 50 characters.').bail()
        // Check if there are only letter
        .matches(/^[a-zA-Z\s]+$/).withMessage('Your first name may only contain letters.'),

    // 4. Validate phoneNumber
    check('phoneNumber')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter your phone number.').bail()
        // Check if what was entered is a valid phone number
        .isMobilePhone('any', {strictMode: false}).withMessage('Please enter a valid phone number.'),

    // 5. Validate school
    check('school')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter your school.').bail()
        // Check if there are only letter
        .matches(/^[a-zA-Z0-9\s\/\(\)\-\+\',’&]+$/).withMessage('Please remove invalid characters from your school.'),

    // 6. Validate major
    check('major')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check if there are any invalid characters
        .matches(/^[a-zA-Z\s\/\(\)\-\+\',’&.]+$/).withMessage('Please remove invalid characters from your major.'),

    // 7. Validate Level of Study
    check('levelOfStudy')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter your level of study.').bail()
        // Check if there are any invalid characters
        .matches(/^[a-zA-Z0-9\s\/\(\)\-\+\',’:&]+$/).withMessage('Please remove invalid characters from your level of study.'),

    // 8. Validate graduationYear
    check('graduationYear')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check if the input is numeric
        .isNumeric().withMessage('Please enter your graduation year with numbers only.').bail()
        .isInt({gt: 1900}).withMessage('Invalid graduation year.'),

    // 9. Validate country
    check('country')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please select a country.').bail()
        // Check if the input is letters
        .isAlpha().withMessage('Please enter your country with letters only.'),

    // 10. Validate age
    check('age')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter your age.').bail()
        // Check if the input is numbers, if not then bail
        .isNumeric().withMessage('Please enter your age with numbers only.').bail()
        // Check if the user is at least 13 years old
        .isInt({gt: 12}).withMessage('You must be at least 13 years old to register.'),

    // 11. Validate gender
    check('gender')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check if the input contains only characters and -
        .matches(/^[a-zA-Z-]+$/).withMessage('Please remove invalid characters from your gender.'),

    // 12. Validate pronouns
    check('pronouns')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check if the input contains only lowercase characters / and ,
        .matches(/^[a-z/,]+$/).withMessage('Please remove invalid characters and uppercase letters from your pronouns.'),

    // 13. Validate tShirtSize
    check('tShirtSize')
        // Check if the field is empty, bail if it is
        .notEmpty().withMessage('Please enter your shirt size.').bail()
        // Check if the input contains only upper case letters
        .matches(/^[A-Z]+$/).withMessage('Your shirt size should be in uppercase letters only.'),

    // 14. Validate hackathonsAttended
    check('hackathonsAttended')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check if the input only contains numbers
        .isNumeric().withMessage('Please enter numbers only for the amount of hackathons you have attended.'),

    // 15. Validate dietaryRestrictions
    check('dietaryRestrictions')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check that the input only contains letters and valid symbols
        .matches(/^[A-Za-z/,']+$/).withMessage('Invalid symbols detected, please only use characters and , or / to list each dietary restriction.'),

    // .16 Validate LinkedIn url
    check('linkedInUrl')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check that the link entered is valid
        .matches(/^https?:\/\/(www\.)?linkedin\.com\/.*$/).withMessage('Please enter a valid LinkedInURL.'),

    // 17. Validate that the MLH Code of Conduct is accepted
    check('mlhCodeOfConduct')
        // Check that the input is a boolean, if not then bail
        .isBoolean().withMessage('Your answer must be either true or false.').bail()
        // Check that the value is true
        .custom(value =>{
            if (value !== true){
                throw new Error('MLH Code of Conduct must be accepted.')
            }

            return true;
        }),

    // 18. Validate that the MLH Privacy Policy is accepted
    check('mlhPrivacyPolicy')
        // Check that the input is a boolean, if not then bail
        .isBoolean().withMessage('Your answer must be either true or false.').bail()
        // Check that the value is true
        .custom(value =>{
            if (value !== true){
                throw new Error('MLH Privacy Policy must be accepted.')
            }

            return true;
        }),

    // 19. Validate mlhEmailSubscription
    check('mlhEmailSubscription')
        // Mark field as optional
        .optional({values: 'falsy'}).bail()
        // Check that the input is a boolean
        .isBoolean().withMessage('Your answer must be either true or false.')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => {
            console.log(err.path);
            formattedErrors[err.path] = err.msg;
        });

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: formattedErrors
        });

    }
    next();
}

module.exports = { checkBodyForSpecialCharacters, userValidationRules, validate };