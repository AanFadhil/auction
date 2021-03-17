import * as actionTypes from './actionTypes';
import axios from '../../axios-helper';

export const placeBid = ({ amount, itemId }) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: actionTypes.PLACE_BID })
            axios.api.post('/bid',{
                amount, 
                itemId
            })
                .then(res => {

                    if (res) {
                        dispatch({
                            type: actionTypes.PLACE_BID_SUCCESS,
                            newbid: res.data
                        })
                        resolve(res.data)
                    } else {
                        const err = new Error('Unauthorized')
                        dispatch({
                            type: actionTypes.PLACE_BID_FAILED,
                            error: err
                        })
                        reject(err)
                    }
                })
                .catch(err => {

                    dispatch({
                        type: actionTypes.PLACE_BID_FAILED,
                        error: err
                    })
                    reject(err)
                })
        })

    }
}