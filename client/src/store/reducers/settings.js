import * as actionTypes from '../actions/actionTypes';
import produce from 'immer'

const initialState = {
    loading: {
        get: true,
        save: false
    },
    settings: {}
};


const getSettings = (state, action) => {
    return produce(state, draft => {
        draft.loading.get = true
    });
}

const getSettingsSuccess = (state, action) => {
    return produce(state, draft => {
        draft.settings = action.settings
        draft.loading.get = false
    });
};

const getSettingsFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.get = false;
        draft.settings = {};
    });
};


const setSettings = (state, action) => {
    return produce(state, draft => {
        draft.loading.save = true
    });
}

const setSettingsSuccess = (state, action) => {
    return produce(state, draft => {
        draft.loading.save = false
    });
};

const setSettingsFail = (state, action) => {
    return produce(state, draft => {
        draft.loading.save = false;
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SETTINGS: return getSettings(state, action);
        case actionTypes.GET_SETTINGS_SUCCESS: return getSettingsSuccess(state, action);
        case actionTypes.GET_SETTINGS_FAILED: return getSettingsFail(state, action);
        
        case actionTypes.SET_SETTINGS: return setSettings(state, action);
        case actionTypes.SET_SETTINGS_SUCCESS: return setSettingsSuccess(state, action);
        case actionTypes.SET_SETTINGS_FAILED: return setSettingsFail(state, action);
        default: return state;
    }
};

export default reducer;