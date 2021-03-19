const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const { getRedisClient } = require('../utils/utilities');
const redisClient = getRedisClient()
const log = require('../logger')

var io = null

exports.start = (http) => {
    io = socketio(http, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      })

    log.info('WS : socket starting');

    io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));

    log.info('WS : socket connected to redis');
    io.on('connection', (socket) => {

        socket.on('register', token => {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

                const key = 'ws_' + decoded.id
                redisClient.get(key, (err, val) => {
                    
                    const split = val ? val.split(',') : []
                    split.push(socket.id)
                    split.filter(i => i !== '')
                    
                    redisClient.set(key, split.join(','))
                })
                const keyMap = 'wsmap_' + socket.id
                redisClient.set(keyMap, decoded.id)
            } catch (error) {

            }

        })

        socket.on('disconnect', function () {
            let key = 'wsmap_' + socket.id

            redisClient.get(key, (err, val) => {
                if (val) {
                    redisClient.get('ws_' + val, (err, value) => {
                        const split = (value || '').split(',')
                        const result = [...split.filter(i => i != socket.id)]
                        if (result.length > 0) {
                            redisClient.set('ws_' + val, result.join(','))
                        } else {
                            redisClient.del('ws_' + val)
                        }

                    })
                }

                redisClient.del(key)
            })
        });
    });

}

exports.io = () => {
    return io
}