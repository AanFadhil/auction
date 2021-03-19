const compose = require('compose-middleware').compose;
const { query, validationResult } = require('express-validator/check');

const validationError = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next()
    }

}

module.exports = ({ service, exportFields, exportFileName, auth }) => {
    const middlewares = [
        (req, res, next) => {

            if (typeof auth !== 'undefined' && auth !== null && req.query.out !== 'csv') {
                auth(req, res, next)
            } else {
                next()
            }
        },
        [
            query('ln').optional().isNumeric().toInt(),
            query('page').optional().isNumeric().toInt(),
        ],
        validationError,
        (req, res, next) => {

            let paging = {
                q: req.query.q || '',
                page: req.query.page,
                perPage: req.query.ln,
                sort : req.query.sr,
                sortDir : req.query.srdir == '0' ? -1 : 1 //default ascending
            }

            service(paging, req)
                .then(result => {

                    return res.status(200).json(result);

                })
                .catch(err => next(err))

        }
    ]

    return compose(middlewares)
}