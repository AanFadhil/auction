import * as actionTypes from './actionTypes'
import conifg from '../../config'
import { storageSetItem, storageRemoveItem } from '../../utilities/utilities'
import axios, { changeToken } from '../../axios-helper';


export const validateToken = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            
            axios.api.post('/auth/validatetoken')
                .then(res => {
                    
                    if (res) {
                        dispatch({
                            type: actionTypes.VALIDATE_TOKEN_SUCCESS,
                            user: res.data
                        })
                        resolve(res.data)
                    } else {
                        const err = new Error('Unauthorized')
                        dispatch({
                            type: actionTypes.VALIDATE_TOKEN_FAILED
                        });
                        reject(err)
                    }
                })
                .catch(err => {
                    
                    dispatch({
                        type: actionTypes.VALIDATE_TOKEN_FAILED
                    });
                    reject(err)
                });
        })

    }
}


export const login = (data) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            
            axios.api.post('/auth/login', data)
                .then(res => {
                    
                    if (res.data.token) {
                        storageSetItem(conifg.AUTH_STORAGE_KEY, res.data.token)
                        changeToken(res.data.token)
                    }
                    dispatch({
                        type: actionTypes.LOGIN_SUCCESS,
                        user: res.data
                    });
                    return resolve(res.data)
                })
                .catch(err => {
                    
                    dispatch({
                        type: actionTypes.LOGIN_FAILED,
                        error: err
                    });
                    return reject(err)
                });
        })

    };
};


export const logout = (data) => {
    return dispatch => {
        storageRemoveItem(conifg.AUTH_STORAGE_KEY)
        changeToken('')
        dispatch({
            type: actionTypes.LOGOUT
        })
    };
};