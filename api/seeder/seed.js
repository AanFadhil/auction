const Item = require('../models/item')
const User = require('../models/user')
const dotenv = require('dotenv').config()
const log = require('../logger')
const mongoose = require('mongoose')
const { addHours } = require('date-fns')

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

        const itemAges = [
            "100 y.o",
            "700 y.o",
            "500 y.o",
            "350 y.o",
            "850 y.o",
            "100 BC",
            "200 BC",
            "300 BC"
        ]

        const itemAttr = [
            "Wooden",
            "Antique",
            "Bronze",
            "Romanian",
            "Renaissance",
            "Van Gogh",
            "Arabic",
            "Ancient Japanese",
            "Ottoman"
        ]

        const items = [
            "Tea Pot",
            "Pottery",
            "Dinning Set",
            "Tools",
            "Dress",
            "Sword",
            "Table",
            "Lamp",
            "Bag",
            "Statue",
            "Armor",
            "Bow and Arrow",
            "Chair"
        ]

        const descTemplate = '{name}, consectetur adipiscing elit. Vestibulum commodo ut ligula eu pulvinar. Phasellus a imperdiet nunc. Integer consectetur quis sapien nec interdum'

        const itemsData = []

        const randomInt = () => Math.ceil(Math.random() * 100000)
        const randomPrice = () => ((Math.ceil(Math.random() * 100))*50)+500
        const randomCloseTime = () => Math.ceil(Math.random() * (10 * 24))
        const today = new Date()
        for (let index = 0; index < 100; index++) {
            const itemName = `${itemAges[randomInt() % itemAges.length]} ${itemAttr[randomInt() % itemAttr.length]} ${items[randomInt() % items.length]}`

            const desc = descTemplate.replace(/{name}/g, itemName)

            const startingPrice = randomPrice()
            
            itemsData.push({
                name:itemName,
                desc,
                startingPrice,
                closeTime: addHours(today,randomCloseTime()),
                thumbnail: 'https://placeimg.com/640/480/any/sepia'
            })
        }

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
