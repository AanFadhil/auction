let Queue = require('bull');
const utils = require('../utils/utilities')
const log = require('../logger')

const enums = require('../enums')
const datajobs = require('./dataJobs')
const notifjobs = require('./notificationJobs')


const config = {
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }
}


let updateUserCurrentBidAmount = new Queue(enums.dataJobs.UPDATE_USER_CURRENT_BID_AMOUNT, config);
updateUserCurrentBidAmount.process(datajobs.updateUserBidAmount)

let newBidItemNotif = new Queue(enums.notifJobs.NEW_ITEM_BID, config);
newBidItemNotif.process(notifjobs.newBidNotif)


let autoBid = new Queue(enums.dataJobs.AUTO_BID, config);
autoBid.process(datajobs.placeAutoBid)

autoBid.on('completed', (job, result) => {
    log.debug(`auto bid completed for ${job.data.itemId}`)
    log.debug(`sending notif new bid for ${job.data.itemId}`)
    
    newBidItemNotif.add({itemId:job.data.itemId })
    log.debug(`checking next auto bid`)
    datajobs.continueAutoBid({ lastJobData: job.data })
        .then(res => {
            if (res.continue) {
                log.debug(`auto bid continue`)
                const { itemId, nextBidder, bidderCount } = res
                autoBid.add({ itemId, nextBidder, bidderCount }, { delay: enums.AUTOBID_DELAY })
            } else {
                log.info('stoped auto bid for item : ' + res.itemId)
            }
        })

})

module.exports = {
    updateUserCurrentBidAmount,
    autoBid,
    newBidItemNotif
}