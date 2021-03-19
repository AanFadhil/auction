import * as actionTypes from './actionTypes';
import axios from '../../axios-helper';

export const getSettings = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: actionTypes.GET_SETTINGS })
            axios.api.get('/settings')
                .then(res => {

                    if (res) {
                        dispatch({
                            type: actionTypes.GET_SETTINGS_SUCCESS,
                            settings: res.data
                        })
                        resolve(res.data)
                    } else {
                        const err = new Error('Unauthorized')
                        dispatch({
                            type: actionTypes.GET_SETTINGS_FAILED,
                            error: err
                        })
                        reject(err)
                    }
                })
                .catch(err => {

                    dispatch({
                        type: actionTypes.GET_SETTINGS_FAILED,
                        error: err
                    })
                    reject(err)
                })
        })

    }
}



export const setSettings = ({ maxAutoBidAmount }) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: actionTypes.SET_SETTINGS })
            axios.api.post('/settings/maxautobid', { maxAutoBidAmount })
                .then(res => {

                    if (res) {
                        dispatch({
                            type: actionTypes.SET_SETTINGS_SUCCESS,
                            settings: res.data
                        })
                        resolve(res.data)
                    } else {
                        const err = new Error('Unauthorized')
                        dispatch({
                            type: actionTypes.SET_SETTINGS_FAILED,
                            error: err
                        })
                        reject(err)
                    }
                })
                .catch(err => {

                    dispatch({
                        type: actionTypes.SET_SETTINGS_FAILED,
                        error: err
                    })
                    reject(err)
                })
        })

    }
}