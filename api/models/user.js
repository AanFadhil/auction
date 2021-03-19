const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email: String,
    password : String,
    maxAutoBidAmount : {
        type : Number,
        default : 0
    },
    currentBidAmount :  {
        type : Number,
        default : 0
    },
    currentAutoBidAmount :  {
        type : Number,
        default : 0
    },
    profilePict : String
},{timestamps: true})

module.exports = mongoose.model('User', UserSchema)