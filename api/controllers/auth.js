const { validationResult, body } = require('express-validator/')
const express = require('express')
const isAuth = require('../middlewares/isAuth')
const router = express.Router()

const authSvc = require('../services/auth')

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
    ]
    , (req, res, next) => {
        authSvc.login({
            email: req.body.email,
            password: req.body.password
        })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    })

router.post('/validatetoken', isAuth(), (req, res, next) => {
    const { email, name, id } = req.userData

    res.json({
        email, 
        name, 
        id
    })

})

module.exports = router