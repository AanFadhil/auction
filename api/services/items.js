const utils = require('../utils/utilities')
const Item = require('../models/item')
const Bid = require('../models/bid')
const log = require('../logger')

exports.getById = id => {
    return new Promise((resolve, reject) => {
        Item
        .findById(id)
        .select([
            '-bids.user.password',
            '-bids.user.email',
            '-bids.user.maxAutoBidAmount',
            '-bids.user.currentBidAmount'
        ])
        .populate('bids')
        .populate('bids.user')
            .then(res => {
                resolve(res)
            })
            .catch(reject)
    })
}

exports.getList = (paging) => {
    return new Promise((resolve, reject) => {

        paging = paging || {}

        let { sort, sortDir, q } = paging

        let filter = {

        }

        if (q) {
            filter["$or"] = [
                { name: { "$regex": q, "$options": "i" } },
                { desc: { "$regex": q, "$options": "i" } }
            ]
        }

        let fieldselect = [
            'name',
            'closeTime',
            'currentTopBid',
            'startingPrice',
            'status',
            'desc',
            'thumbnail',
            'bidderCount'
        ]

        let sorting = {}

        if (sort) {
            sorting[sort] = sortDir
        } else {
            sorting.createdAt = -1
        }

        utils.pagingExecute(Item, {
            ...paging,
            filter,
            fieldselect,
            sort: sorting
        })
            .then(resolve)
            .catch(err => reject(err))
    })
}