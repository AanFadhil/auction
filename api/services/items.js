const utils = require('../utils/utilities')
const Item = require('../models/item')
const Bid = require('../models/bid')
const log = require('../logger')
const _ = require('lodash')

exports.getById = ({id,userId}) => {
    return new Promise((resolve, reject) => {
        Item
            .findById(id)
            .populate([
                {
                  path: 'bids',
                  select: '_id amount bidAt',
                  populate: {
                    path: 'user',
                    select: 'name'
                  }
                },
                {
                    path: 'highestBidder',
                    select: '_id name'
                },
              ])
            .lean()
            .then(res => {
                resolve({
                    ...res,
                    bids : _.orderBy(res.bids,['bidAt'],['desc']),
                    autoBidders : (res.autoBidders||[]).filter(t => t.toString() === userId)
                })
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

exports.getBidsHistory = ({itemId}) => {
    return new Promise((resolve, reject) => {
        Item
            .findById(itemId)
            .populate([
                {
                  path: 'bids',
                  select: '_id amount bidAt',
                  populate: {
                    path: 'user',
                    select: 'name profilePict'
                  }
                }
              ])
              
            .select('bids highestBidder currentTopBid')
            .lean()
            .then(res => {
                resolve({
                    ...res,
                    bids : _.orderBy(res.bids,['bidAt'],['desc'])
                })
            })
            .catch(reject)
    })
}