const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.login = ({ email, password }) => {
    return new Promise((resolve, reject) => {

        User
            .findOne({ email, password })
            .lean()
            .then(res => {
                if (res) {
                    const token = jwt.sign({
                        id: res._id.toString(),
                        email: res.email,
                        name: res.name
                    }, process.env.TOKEN_SECRET)

                    resolve({
                        success : true,
                        id: res._id.toString(),
                        email: res.email,
                        name: res.name,
                        profilePict : res.profilePict,
                        token
                    })

                } else {
                    resolve({
                        success : false,
                        message : "Invalid email or password"
                    })
                }
            })
            .catch(reject)

    })
}

exports.getUserById = id => {
    return new Promise((resolve, reject) => {

        User.findById(id)
        .select(['_id','name','email','currentBidAmount','profilePict'])
        .lean()
        .then(resolve)
        .catch(reject)
    })
}