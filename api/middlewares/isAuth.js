const jwt = require('jsonwebtoken')

module.exports = (opt) => {
    opt = opt || {}
    return (req, res, next) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error)
        }

        const split = authHeader.split(' ');

        if (split.length < 2) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error)
        }

        const token = split[1];
        let decodedToken;

        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            req.decodedToken = decodedToken
        } catch (err) {
            err.statusCode = 401;
            const error = new Error('Not authenticated.');
            next(error)
        }

        if (!decodedToken) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error);
        }

        req.userData = decodedToken;
        next();


    }
};
