import * as actionTypes from '../actions/actionTypes';
import produce from 'immer'

const initialState = {
    loading: {
        items: true
    },
    items: {}
};


const getArchivedOrders = (state, action) => {
    return produce(state, draft => {
        draft.loading.items = true
    });
}

const getArchivedOrdersSuccess = (state, action) => {
    return produce(state, draft => {
        draft.items = action.items
        draft.loading.items = false
    });
};

const getArchivedOrdersFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.items = false;
        draft.items = [];
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ITEMS: return getArchivedOrders(state, action);
        case actionTypes.GET_ITEMS_SUCCESS: return getArchivedOrdersSuccess(state, action);
        case actionTypes.GET_ITEMS_FAILED: return getArchivedOrdersFail(state, action);
        default: return state;
    }
};

export default reducer;