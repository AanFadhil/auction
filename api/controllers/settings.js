const { validationResult, body } = require('express-validator/')
const express = require('express')
const isAuth = require('../middlewares/isAuth')
const router = express.Router()

const settingsSvc = require('../services/settings')
const worker = require('../worker/worker')
const log = require('../logger')

router.get('/',
    isAuth({}),
    (req, res, next) => {
        settingsSvc.getUserSettings({userId:req.userData.id})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }
)


router.post('/maxautobid',
    isAuth({}),
    [
        body('maxAutoBidAmount')
            .isNumeric()
            .bail()
            .withMessage('Please enter a valid amount')
    ],
    (req, res, next) => {
        settingsSvc.setMaxAutoBidAmount({
            userId: req.userData.id,
            maxAmount : req.body.maxAutoBidAmount
        })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }
)
module.exports = router