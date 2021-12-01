const { INTERNAL_ERROR } = require('../utils/statusHttp');

const handleError = (err, _req, res, _next) => {
    console.log(err);
    if (err.status) {
        const { message, status } = err;
        return res.status(status).json({ message });
    }

    return res.status(INTERNAL_ERROR).json({ message: 'Internal server error' });
};

module.exports = { handleError };