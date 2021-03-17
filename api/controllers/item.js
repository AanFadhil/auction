const { validationResult, body } = require('express-validator/')
const express = require('express')
const isAuth = require('../middlewares/isAuth')
const pagination = require('../middlewares/pagination')
const router = express.Router()

const itemsSvc = require('../services/items')

router.get('/',
    isAuth({}),
    pagination({
        service: itemsSvc.getList
    })
)

module.exports = router