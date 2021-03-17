const utils = require('../utils/utilities')
const Bid = require('../models/bid')
const log = require('../logger')
const enums = require('../enums')
const ObjectId = require('mongoose').Types.ObjectId

exports.getUserCurrentBids = (userId) => {
    return new Promise((resolve, reject) => {
        Bid.find({
            user : ObjectId(userId),
            "item.status" : enums.itemStatus.OPEN
        })
    })
}