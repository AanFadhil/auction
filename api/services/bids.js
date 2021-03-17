const utils = require('../utils/utilities')
const Bid = require('../models/bid')
const Item = require('../models/item')
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

exports.manualPalceBid = ({itemId,userId,amount}) => {
    return new Promise((resolve, reject) => {
        let item = null
        let bidObj = null
        Item.findById(itemId)
            .populate('bids')
            .then(res => {
                item = res
                
                const now = new Date()
                
                if(res && amount > res.currentTopBid && now < res.closeTime){
                    let newBid = new Bid({
                        item : new ObjectId(itemId),
                        user : new ObjectId(userId),
                        bidAt : now,
                        amount : amount,
                        madeBy : enums.bidMadeBy.USER
                    })
                    return newBid.save()
                    
                } else {
                    return Promise.reject(utils.createError("Invalid Bid",500))
                }
            })
            .then(res =>{
                if(res){
                    bidObj = res.toJSON()
                    item.bids.push(res)
                    item.currentTopBid = amount
                    return item.save()
                }
            })
            .then(res => {
                resolve(bidObj)
            })
            .catch(reject)
    })
}