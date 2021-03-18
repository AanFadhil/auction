const types = require('mongoose').Types
const Bid = require('../models/bid')
const Item = require('../models/item')
const User = require('../models/user')
const log = require('../logger')
const enums = require('../enums')



exports.updateUserBidAmount = (job, done) => {
    const { userId } = job.data
    const now = new Date()

    log.debug('updateing user bid amount', userId)

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

            console.log(userRes, sumRes);

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

    Item.findById(itemId)
        .populate('autoBidders', '-password')
        .then(res => {
            let result = {}
            if (res.status === enums.itemStatus.OPEN && bidderCount > 1) {
                let nextBidderIndex = (lastBidderIndex + 1) % bidderCount
                let validBidder = false
                let nextBidderId = ''

                while (!validBidder) {
                    const bidder = res.autoBidders[nextBidderIndex]
                    validBidder = bidder.currentAutoBidAmount < bidder.maxAutoBidAmount && bidder._id.toString() !== lastUserId
                    if (!validBidder) nextBidderIndex = (nextBidderIndex + 1) % bidderCount
                    else {
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
    let itemRef = null
    Promise.all([
        User.findById(userId),
        Item.aggregate([
            {
                $match: {
                    highestBidder: types.ObjectId(userId),
                    status: enums.itemStatus.OPEN,
                    autoBidders: { $elemMatch: types.ObjectId(userId) }
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

            if (autoBidSum.length > 0) {
                bidSum = autoBidSum[0].amount
            }

            let newBid = itemObj.currentTopBid + enums.AUTO_BID_INCREMET
            user.currentAutoBidAmount = bidSum

            if (bidSum + newBid > userObj.maxAutoBidAmount) {
                return Promise.all([user.save(), Promise.resolve(null)])
            }

            let newBid = new Bid({
                item: new ObjectId(itemId),
                user: new ObjectId(userId),
                bidAt: new Date(),
                amount: amount,
                madeBy: enums.bidMadeBy.BOT
            })
            return Promise.all([user.save(), newBid.save()])

        })
        .then(([user, newBid]) => {

            bidObj = newBid.toJSON()
            item.bids.push(newBid)
            item.currentTopBid = bidObj.amount

            item.highestBidder = ObjectId(userId)
            return item.save()

        })
        .then(res => done())
        .catch(err => done())

}
