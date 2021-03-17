const mongoose = require('mongoose')
const enums = require('../enums')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name: String,
    closeTime : Date,
    currentTopBid: Number,
    startingPrice : Number,
    bids : {
        type : [{
            type: Schema.Types.ObjectId,
            ref: "Bid"
        }],
        default : []
    },
    status: {
        type : String,
        default : enums.itemStatus.OPEN
    },
    desc : String,
    thumbnail : String,
    bidderCount : Number
},{timestamps: true})

module.exports = mongoose.model('Item', ItemSchema)