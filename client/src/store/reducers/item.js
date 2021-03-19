import * as actionTypes from '../actions/actionTypes';
import produce from 'immer'

const initialState = {
    loading: {
        items: true,
        item: true
    },
    items: {},
    item: {}
};


const getItems = (state, action) => {
    return produce(state, draft => {
        draft.loading.items = true
    });
}

const getItemsSuccess = (state, action) => {
    return produce(state, draft => {
        draft.items = action.items
        draft.loading.items = false
    });
};

const getItemsFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.items = false;
        draft.items = [];
    });
};


const getItemById = (state, action) => {
    return produce(state, draft => {
        draft.loading.item = true
    });
}

const getItemByIdSuccess = (state, action) => {
    return produce(state, draft => {
        draft.item = action.item
        draft.loading.item = false
    });
};

const getItemByIdFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.item = false;
        draft.item = [];
    });
};



const updateItemBid = (state, action) => {
    return produce(state, draft => {
        draft.loading.item = true
    });
}

const updateItemBidSuccess = (state, action) => {
    return produce(state, draft => {
        
        draft.loading.item = false

        if (draft.item._id === action.item._id) {
            draft.item.bids = action.item.bids
            draft.item.highestBidder = action.item.highestBidder
            draft.item.currentTopBid = action.item.currentTopBid
        }
    });
};

const updateItemBidFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.item = false;
        draft.item = [];
    });
};





const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ITEMS: return getItems(state, action);
        case actionTypes.GET_ITEMS_SUCCESS: return getItemsSuccess(state, action);
        case actionTypes.GET_ITEMS_FAILED: return getItemsFail(state, action);

        case actionTypes.GET_ITEM_BY_ID: return getItemById(state, action);
        case actionTypes.GET_ITEM_BY_ID_SUCCESS: return getItemByIdSuccess(state, action);
        case actionTypes.GET_ITEM_BY_ID_FAILED: return getItemByIdFail(state, action);

        case actionTypes.UPDATE_ITEM_BID: return updateItemBid(state, action);
        case actionTypes.UPDATE_ITEM_BID_SUCCESS: return updateItemBidSuccess(state, action);
        case actionTypes.UPDATE_ITEM_BID_FAILED: return updateItemBidFail(state, action);
        default: return state;
    }
};

export default reducer;