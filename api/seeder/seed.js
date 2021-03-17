const Item = require('../models/item')
const User = require('../models/user')
const dotenv = require('dotenv').config()
const log = require('../logger')
const mongoose = require('mongoose')

const seedUser = () => {

    return new Promise((resolve, reject) => {
        log.info('user seeding started')

        const userData = [
            {
                name: "John Doe",
                email: "johndoe@auction.com",
                password: "john123"
            },
            {
                name: "Smith",
                email: "smith@auction.com",
                password: "smith123"
            }
        ]

        User
            .insertMany(userData)
            .then(result => {
                log.info('user seeding completed')
                resolve()
            })
            .catch(err => {
                log.error('user seeding failed', err)
                resolve()
            })

    })
}


const seedItems = () => {

    return new Promise((resolve, reject) => {
        log.info('items seeding started')

        const itemsData = []

        Item
            .insertMany(itemsData)
            .then(result => {
                log.info('items seeding completed')
                resolve()
            })
            .catch(err => {
                log.error('items seeding failed', err)
                resolve()
            })

    })
}


log.info('connection db')
mongoose
    .connect(
        process.env.MONGO_CONNECTION_STRING
        , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(result => {

        log.info('seeding started')
        return Promise.all([
            seedUser(),
            seedItems()
        ])

    })
    .then(res => {
        log.info('seeding completed')
        process.exit()
    })
    .catch(err => log.error(err));
