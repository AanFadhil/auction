const utils = require('../utils/utilities')
const log = require('../logger')
const _ = require('lodash')
const User = require('../models/user')

exports.setMaxAutoBidAmount = ({userId,maxAmount}) => {
    return new Promise((resolve, reject) => {
       User.findById(userId) 
       .then(res => {

            if(res){
                res.maxAutoBidAmount = maxAmount
                return res.save()
            } else {
                return Promise.reject(utils.createError("User not found",400))
            }
       })
       .then(res=> {
           
           resolve({
               userId,
               maxAmount,
               currentBidAmount: res.currentBidAmount
           })
       })
       .catch(reject)
    })
}


exports.getUserSettings = ({userId}) => {
    return new Promise((resolve, reject) => {
       User.findById(userId) 
       .then(res => {
            const { maxAutoBidAmount, _id:id, email, name } = res.toJSON()
            if(res){
                resolve({
                    id,
                    name,
                    email,
                    maxAutoBidAmount
                })
            } else {
                reject(utils.createError("User not found",400))
            }
       })
       .catch(reject)
    })
}