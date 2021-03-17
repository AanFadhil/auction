const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BidSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item' 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    bidAt: Date,
    amount : Number,
    madeBy : String
})

module.exports = mongoose.model('Bid', BidSchema)