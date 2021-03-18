const utils = require('../utils/utilities')
const Bid = require('../models/bid')
const Item = require('../models/item')
const User = require('../models/user')
const log = require('../logger')
const enums = require('../enums')
const worker = require('../worker/worker')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const _ = require('lodash')

exports.getUserCurrentBids = (userId) => {
    return new Promise((resolve, reject) => {
        Bid.find({
            user: ObjectId(userId),
            "item.status": enums.itemStatus.OPEN
        })
    })
}

const startAutoBid = (itemId) => {
    
}

exports.manualPalceBid = ({ itemId, userId, amount }) => {
    return new Promise((resolve, reject) => {
        let item = null
        let bidObj = null
        Item.findById(itemId)
            .populate('bids')
            .then(res => {
                item = res

                const now = new Date()

                if (res && amount > res.currentTopBid && now < res.closeTime) {
                    let newBid = new Bid({
                        item: new ObjectId(itemId),
                        user: new ObjectId(userId),
                        bidAt: now,
                        amount: amount,
                        madeBy: enums.bidMadeBy.USER
                    })
                    return newBid.save()

                } else {
                    return Promise.reject(utils.createError("Invalid Bid", 500))
                }
            })
            .then(res => {
                if (res) {
                    bidObj = res.toJSON()
                    item.bids.push(res)
                    item.currentTopBid = amount

                    item.highestBidder = ObjectId(userId)
                    return item.save()
                }
            })
            .then(res => {
                const resObj = res.toJSON()
                console.log(resObj.autoBidActive,resObj.autoBidders);
                if(!resObj.autoBidActive && resObj.autoBidders.length > 0){
                    log.debug('starting auto bid')
                    worker.autoBid.add({ 
                        itemId, 
                        nextBidder : {id: resObj.autoBidders[0].toString(), index: 0}, 
                        bidderCount: resObj.autoBidders.length 
                    }, { delay: enums.AUTOBID_DELAY })    
                }

                worker.updateUserCurrentBidAmount.add({userId})
                resolve(bidObj)
            })
            .catch(reject)
    })
}


exports.setAutoBid = ({ itemId,userId, autoBid }) => {
    return new Promise((resolve, reject) => {
        Item.findById(itemId)
        .then(res => {
            let resObj = res.toJSON()
            if(res){
                let newBidders = [...resObj.autoBidders]
                
                if(autoBid && newBidders.findIndex(t => t.toString() === userId) < 0){
                    log.debug('set new autobidder')
                    newBidders.push(ObjectId(userId))
                } 
                
                if(!autoBid) {
                    log.debug('remove autobidder')
                    newBidders = newBidders.filter(t => t.toString() != userId)
                }
                
                res.autoBidders = newBidders
                return res.save()
            } else {
                return Promise.reject(utils.createError("Item not found",400))
            }
        })
        .then(res => {
            resolve(res.toJSON())
        })
        .catch(reject)
    })
}