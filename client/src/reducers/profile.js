import { GET_PROFLE, PROFILE_ERROR, UPDATE_PROFILE } from "../actions/types";

const initialState = {
   profile: null,
   profiles: [],
   repos: [],
   loading: true,
   error: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFLE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
                return {
                    ...state,
                    error: payload,
                    loading: false
                }
        default:
            return state;

    }
};