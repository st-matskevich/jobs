import { FEED_SCOPE } from "../api/backend";

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case "REQUEST_PROFILE_STARTED":
            return {
                ...state,
                profile: {
                    loading: true
                }
            };
        case "REQUEST_PROFILE_SUCCEESS":
            return {
                ...state,
                profile: {
                    data: action.payload
                }
            };
        case "REQUEST_PROFILE_ERRORR":
            return {
                ...state,
                profile: {
                    error: action.payload
                }
            };
        case "SET_TASKS_FEED_SCOPE":
            return {
                ...state,
                feedScope: action.payload
            };
        default:
            return state;
    }
}

const initialState = {
    profile: {
        loading: true
    },
    feedScope: FEED_SCOPE.NOT_ASSIGNED
}