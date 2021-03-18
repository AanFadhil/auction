let Queue = require('bull');
const utils = require('../utils/utilities')

const enums = require('../enums')
const datajobs = require('./dataJobs')


let updateUserCurrentBidAmount = new Queue(enums.dataJobs.UPDATE_USER_CURRENT_BID_AMOUNT, config);
talentInternalJobNotif.process(datajobs.updateUserBidAmount)

let autoBid = new Queue(enums.dataJobs.AUTO_BID, config);
autoBid.process(datajobs.autoBid)

module.exports = {
    updateUserCurrentBidAmount,
    autoBid
}