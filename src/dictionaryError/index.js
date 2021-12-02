const {
    BAD_REQUEST,
    UNAUTHORIZED,
    CONFLICT,
    NOT_FOUND,
    FORBIDDEN,
} = require('../utils/statusHttp');

module.exports = {
    jwtMalformed: () => ({
        status: UNAUTHORIZED,
        message: 'jwt malformed',
    }),

    invalidEntries: () => ({
        status: BAD_REQUEST,
        message: 'Invalid entries. Try again.',
    }),

    incorrectNameOrPass: () => ({
        status: UNAUTHORIZED,
        message: 'Incorrect username or password',
    }),

    allFields: () => ({
        status: UNAUTHORIZED,
        message: 'All fields must be filled',
    }),

    emailAlreadyExists: () => ({
        status: CONFLICT,
        message: 'Email already registered',
    }),

    recipeNotFound: () => ({
        status: NOT_FOUND,
        message: 'recipe not found',
    }),

    missingAuthToken: () => ({
        status: UNAUTHORIZED,
        message: 'missing auth token',
    }),

    onlyAdmins: () => ({
        status: FORBIDDEN,
        message: 'Only admins can register new admins',
    }),
};