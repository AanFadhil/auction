let Queue = require('bull');
const utils = require('../utils/utilities')
const log = require('../logger')

const enums = require('../enums')
const datajobs = require('./dataJobs')


const config = {
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }
}


let updateUserCurrentBidAmount = new Queue(enums.dataJobs.UPDATE_USER_CURRENT_BID_AMOUNT, config);
updateUserCurrentBidAmount.process(datajobs.updateUserBidAmount)


let autoBid = new Queue(enums.dataJobs.AUTO_BID, config);
autoBid.process(datajobs.autoBid)

autoBid.on('completed', (job, result) => {

    datajobs.continueAutoBid({ lastJobData: job.data })
        .then(res => {
            if (res.continue) {
                const { itemId, nextBidder, bidderCount } = res
                autoBid.add({ itemId, nextBidder, bidderCount }, { delay: enums.AUTOBID_DELAY })
            } else {
                log.info('stoped auto bid for item : ' + res.itemId)
            }
        })

})

module.exports = {
    updateUserCurrentBidAmount,
    autoBid
}