const mongoose = require('mongoose')
const enums = require('../enums')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name: String,
    closeTime: Date,
    currentTopBid: Number,
    highestBidder: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    startingPrice: Number,
    bids: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Bid"
        }],
        default: []
    },
    autoBidders: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    status: {
        type: String,
        default: enums.itemStatus.OPEN
    },
    desc: String,
    thumbnail: String,
    bidderCount: Number,
    autoBidActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Item', ItemSchema)