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
                        id: res._id.toString(),
                        email: res.email,
                        name: res.name,
                        token
                    })

                } else {
                    resolve(null)
                }
            })
            .catch(reject)

    })
}