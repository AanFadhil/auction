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
                userRes.currentBidAmount = sumRes.amount
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

exports.autoBid = (job, done) => {


    done()

}
