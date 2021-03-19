const itemStatus = {
    OPEN : "OPEN",
    CLOSED : "CLOSED"
}

const bidMadeBy = {
    USER : "USER",
    BOT : "BOT"
}

const dataJobs = {
    UPDATE_USER_CURRENT_BID_AMOUNT : "UPDATE_USER_CURRENT_BID_AMOUNT",
    AUTO_BID : "PLACE_AUTO_BID"
}
const notifJobs = {
    NEW_ITEM_BID : "NEW_ITEM_BID"
}

module.exports = {
    itemStatus,
    bidMadeBy,
    dataJobs,
    AUTOBID_DELAY : 1000 * 2,
    AUTO_BID_INCREMET : 1,
    notifJobs
}