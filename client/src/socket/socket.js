import {io} from 'socket.io-client';
import * as  config from '../config';

var socket = null
var subscribeWaitlist = []

const connectSocket = (token) => {
    console.log('connecting socket');
    if (!socket) {
        socket = io(config.API_BASE_URL)
        socket.emit('register', token)
        for (let index = 0; index < subscribeWaitlist.length; index++) {
            const element = subscribeWaitlist[index];

            socket.on(element.event, element.cb)
        }
        subscribeWaitlist = []
            console.log('connecting socket success', socket);
    }
}

function subscribeToNewBid(itemId,cb) {
    console.log('subscribing to new bid ',itemId);
    if (socket) {
        socket.on('newbid_'+itemId, data => {
            cb(data)
        });

    } else {
        subscribeWaitlist.push({
            cb,
            event: 'newbid_'+itemId
        })
    }
}
function unsubscribeToNewBid(itemId,cb) {
    if (socket) {
        console.log('UNsubscribing to new bid ',itemId);
        socket.removeAllListeners('newbid_'+itemId);
    }
}


export { subscribeToNewBid, connectSocket, unsubscribeToNewBid };