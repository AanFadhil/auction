import * as actionTypes from './actionTypes';
import axios from '../../axios-helper';

export const getItemList = ({ page, pageSize, search, sort, sortdir }) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: actionTypes.GET_ITEMS })
            axios.api.get('/item', {
                params: {
                    page: page || 1,
                    ln: pageSize || 10,
                    q: search,
                    sr: sort,
                    srdir: sortdir
                }
            })
                .then(res => {

                    if (res) {
                        dispatch({
                            type: actionTypes.GET_ITEMS_SUCCESS,
                            items: res.data
                        })
                        resolve(res.data)
                    } else {
                        const err = new Error('Unauthorized')
                        dispatch({
                            type: actionTypes.GET_ITEMS_FAILED,
                            error: err
                        })
                        reject(err)
                    }
                })
                .catch(err => {

                    dispatch({
                        type: actionTypes.GET_ITEMS_FAILED,
                        error: err
                    })
                    reject(err)
                })
        })

    }
}



export const getItemById = ({ id }) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: actionTypes.GET_ITEM_BY_ID })
            axios.api.get('/item/'+id)
                .then(res => {

                    if (res) {
                        dispatch({
                            type: actionTypes.GET_ITEM_BY_ID_SUCCESS,
                            item: res.data
                        })
                        resolve(res.data)
                    } else {
                        const err = new Error('Unauthorized')
                        dispatch({
                            type: actionTypes.GET_ITEM_BY_ID_FAILED,
                            error: err
                        })
                        reject(err)
                    }
                })
                .catch(err => {

                    dispatch({
                        type: actionTypes.GET_ITEM_BY_ID_FAILED,
                        error: err
                    })
                    reject(err)
                })
        })

    }
}