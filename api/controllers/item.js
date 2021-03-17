const { validationResult, body } = require('express-validator/')
const express = require('express')
const isAuth = require('../middlewares/isAuth')
const pagination = require('../middlewares/pagination')
const router = express.Router()

const itemsSvc = require('../services/items')
const log = require('../logger')

router.get('/',
    isAuth({}),
    pagination({
        service: itemsSvc.getList
    })
)

router.get('/:id',
    isAuth({}),
    (req, res, next) => {
        log.info('get item by id')
        itemsSvc.getById(req.params.id)
        .then(result => {
            res.status(200).json(result)
        })
    }
)

module.exports = router