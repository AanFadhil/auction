const objectId = require('mongoose').Types.ObjectId;
const redis = require('redis')
const config = require('../config');
const { format, parseISO } = require('date-fns');
const id = require('date-fns/locale').id

var client = redis.createClient({
        port: config.REDIS_PORT,
        host: config.REDIS_HOST,
})



exports.getRedisClient = () => {
        return client || redis.createClient({
                port: config.REDIS_PORT,
                host: config.REDIS_HOST,
        })
}

exports.makeCode = (length, charset) => {
        let result = '';
        let characters = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
}


exports.defaultErrorhandler = (next) => {
        return err => {
                if (!err.statusCode) {
                        err.statusCode = 500;
                }
                next(err);
        }
}

exports.addDays = (date, days) => {
        date.setDate(date + days);
        return date;
}


exports.refineDigitNumbering = (number, digit, prefix = '0') => {
        let str = prefix.repeat(digit) + '' + number
        return str.substring(str.length - digit, str.length)
}

exports.toId = id => {
        return objectId(id)
}

exports.createError = (message, statusCode) => {
        let err = Error(message)
        err.statusCode = statusCode || 500
        return err
}

exports.validationError = (errors,) => {
        let err = Error(message)
        err.statusCode = statusCode || 500
        return err
}

const formatNumber = (x, separator) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || ".");
}

exports.formatMoney = (x, currency = 'Rp', separator) => {
        if (x) {
                return currency + '' + formatNumber(x, separator) + ',-';
        } else {
                return '';
        }
}


exports.formatNumber = formatNumber


exports.toPascalCase = s => {
        return s ? s.replace(/(\w)(\w*)/g,
                function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); }) : s;
}


exports.formatDate = (date, strformat) => {
        if (typeof (date) === 'string') {
                let parsed = parseISO(date)

                return format(parsed, strformat, { locale: id })
        } else if (date instanceof Date) {
                return format(date, strformat, { locale: id })
        }

}

exports.pagingQuery = (model, pagingData) => {
        const { filter, fieldselect, perPage, page, sort, populate } = pagingData
        let query = model.find(filter)

        if (populate) {
                query = query.populate(populate || {})
        }

        return new Promise((resolve, reject) => {
                Promise.all([
                        query
                                .select(fieldselect)
                                .limit(perPage)
                                .skip(perPage * page)
                                .sort(sort)
                                .lean(),
                        model.find(filter).countDocuments()
                ])
                        .then(res => {
                                resolve(res)
                        })
                        .catch(err => reject(err))
        })
}

exports.pagingExecute = (model, { filter, fieldselect, perPage, page, sort, populate, out }) => {

        let query = model.find(filter)

        if (typeof populate === 'object') {
                query = query.populate(populate || {})
        }

        query = query
                .select(fieldselect)

        perPage = perPage || config.DEFAULT_PAGE_SIZE
        page = (page || 1) - 1

        query = query.limit(perPage)
                .sort(sort)
                .skip(perPage * page)


        return new Promise((resolve, reject) => {
                Promise.all([
                        query.lean(),
                        model.find(filter).countDocuments()
                ])
                        .then(res => {
                                resolve({
                                        data: res[0],
                                        perPage,
                                        page: page + 1,
                                        pageCount: Math.ceil(res[1] / perPage),
                                        sort,
                                        count: res[1]
                                })
                        })
                        .catch(err => reject(err))
        })
}

exports.arrayInclude = (array, checker) => {
        array = array || []
        checker = checker || (item => { return false })
        let found = false
        for (let i = 0; i < array.length; i++) {
                if (checker(array[i])) {
                        found = true;
                        break;
                }
        }

        return found
}

