import * as actionTypes from '../actions/actionTypes';
import produce from 'immer'

const initialState = {
    loading: {
        bid: false
    }
}

const placeBid = (state, action) => {
    return produce(state, draft => {
        draft.loading.items = true
    });
}

const placeBidSuccess = (state, action) => {
    return produce(state, draft => {
        draft.items = action.items
        draft.loading.items = false
    });
};

const placeBidFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.items = false;
        draft.items = [];
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PLACE_BID: return placeBid(state, action);
        case actionTypes.PLACE_BID_SUCCESS: return placeBidSuccess(state, action);
        case actionTypes.PLACE_BID_FAILED: return placeBidFail(state, action);
        default: return state;
    }
};

export default reducer;