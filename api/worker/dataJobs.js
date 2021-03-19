const types = require('mongoose').Types
const chalk = require('chalk')
const Bid = require('../models/bid')
const Item = require('../models/item')
const User = require('../models/user')
const log = require('../logger')
const enums = require('../enums')



exports.updateUserBidAmount = (job, done) => {
    const { userId } = job.data
    const now = new Date()

    log.debug('updating user bid amount', userId)

    const userPromise = User.findById(userId)
    const sumPromise = Item.aggregate([
        {
            $match: {
                highestBidder: types.ObjectId(userId),
                status: enums.itemStatus.OPEN
            }
        },
        {
            $group: {
                _id: null,
                amount: {
                    $sum: "$currentTopBid"
                }
            }
        }
    ])

    Promise.all([userPromise, sumPromise])
        .then(([userRes, sumRes]) => {

            if (sumRes.length > 0) {
                userRes.currentBidAmount = sumRes[0].amount
            } else {
                userRes.currentBidAmount = 0
            }
            return userRes.save()

        })
        .then(res => done())
        .catch(err => {
            log.error(err)
            done()
        })

}

exports.continueAutoBid = ({
    lastJobData: { itemId, nextBidder: { id: lastUserId, index: lastBidderIndex }, bidderCount }
}) => new Promise(async (resolve, reject) => {
    log.debug(`checking shall auto bid continue`)
    Item.findById(itemId)
        .populate('autoBidders', '-password')
        .then(res => {
            log.debug(`item found`)
            let result = {}
            if (res.status === enums.itemStatus.OPEN && bidderCount > 1) {
                log.debug(`item found and status is OPEN`)
                let nextBidderIndex = (lastBidderIndex + 1) % bidderCount
                let validBidder = false
                let nextBidderId = ''

                while (!validBidder) {
                    const bidder = res.autoBidders[nextBidderIndex]

                    log.debug(`checking valid bidder ${nextBidderIndex} ${bidder._id.toString()}`)
                    validBidder = bidder.currentAutoBidAmount < bidder.maxAutoBidAmount && bidder._id.toString() !== lastUserId
                    if (!validBidder) nextBidderIndex = (nextBidderIndex + 1) % bidderCount
                    else {
                        log.debug(`valid bidder found ${nextBidderIndex} ${bidder._id.toString()}`)
                        nextBidderId = bidder._id.toString()
                    }
                }

                result = {
                    continue: true,
                    itemId,
                    nextBidder: { id: nextBidderId, index: nextBidderIndex },
                    bidderCount: res.autoBidders.length
                }
                res.autoBidActive = true
            } else {
                log.debug(`stopping auto bid`)
                res.autoBidActive = false
                result = {
                    continue: false,
                    itemId
                }
            }

            return Promise.all([res.save(), Promise.resolve(result)])
        })
        .then(([user, result]) => resolve(result))

})


exports.placeAutoBid = ({
    data: { itemId, nextBidder: { id: userId, index: nextBidderIndex }, bidderCount }
}, done) => {
    log.debug(`starting auto bid for item : ${itemId} , user : ${userId}, bidderCount : ${bidderCount}`)
    let itemRef = null
    Promise.all([
        User.findById(userId),
        Item.aggregate([
            {
                $match: {
                    highestBidder: types.ObjectId(userId),
                    status: enums.itemStatus.OPEN,
                    autoBidders: { $elemMatch: { $eq: types.ObjectId(userId) } }
                }
            },
            {
                $group: {
                    _id: null,
                    amount: {
                        $sum: "$currentTopBid"
                    }
                }
            }
        ]),
        Item.findById(itemId)
            .populate('bids')
    ])
        .then(([user, autoBidSum, item]) => {
            let bidSum = 0
            let itemObj = item.toJSON()
            let userObj = user.toJSON()
            itemRef = item

            log.debug('queries finished')

            if (autoBidSum.length > 0) {
                bidSum = autoBidSum[0].amount
            }


            let newBid = itemObj.currentTopBid + enums.AUTO_BID_INCREMET
            user.currentAutoBidAmount = bidSum

            log.debug(`bid sum `, bidSum, ' | new bid ', newBid)

            if (bidSum + newBid > userObj.maxAutoBidAmount) {
                log.debug(chalk.red(`max auto bid amount reached`))
                return Promise.all([user.save(), Promise.resolve(null)])
            }


            log.debug(`creating new bid`)

            let newBidObj = new Bid({
                item: types.ObjectId(itemId),
                user: types.ObjectId(userId),
                bidAt: new Date(),
                amount: newBid,
                madeBy: enums.bidMadeBy.BOT
            })
            user.currentAutoBidAmount = bidSum + newBid

            return Promise.all([user.save(), newBidObj.save()])

        })
        .then(([user, newBid]) => {
            if (newBid) {
                log.debug(`adding bid to item`)
                bidObj = newBid.toJSON()
                itemRef.bids.push(newBid)
                itemRef.currentTopBid = bidObj.amount

                itemRef.highestBidder = types.ObjectId(userId)
                return itemRef.save()
            } else {
                return Promise.resolve()
            }

        })
        .then(res => {
            let objItem = res.toJSON()
            done()
        })
        .catch(err => {
            console.error(err)
            
        })

}
