const mongoose = require('mongoose')
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
    status: String,
    desc : String,
    thumbnail : String,
    bidderCount : Number
})

module.exports = mongoose.model('Item', ItemSchema)