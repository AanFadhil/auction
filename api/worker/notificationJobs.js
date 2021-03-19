const types = require('mongoose').Types
const {io} = require('../socket/socket')
const chalk = require('chalk')
const Bid = require('../models/bid')
const Item = require('../models/item')
const User = require('../models/user')
const log = require('../logger')
const enums = require('../enums')

exports.newBidNotif = (job, done) => {
    const { itemId } = job.data
    log.debug('sending new bid notif '+itemId)
    io().emmit('newbid_'+itemId)
}