import { v4 as uuid, v4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = v4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, id, alertType }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

