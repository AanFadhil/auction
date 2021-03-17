const { validationResult, body } = require('express-validator/')
const express = require('express')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

const bidSvc = require('../services/bids')
const log = require('../logger')


router.post('/',
    isAuth({}),
    [
        body('amount')
            .isNumeric()
            .bail()
            .withMessage('Please enter a valid amount'),
        body('itemId')
            .exists()
            .bail()
            .withMessage('Please enter a valid item')
    ],
    (req, res, next) => {
        bidSvc.manualPalceBid({
            amount : req.body.amount,
            itemId : req.body.itemId,
            userId : req.userData.id
        })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(next)
    }
)

module.exports = router