import { GetUserProfile } from "../api/backend"
import { setAnalyticsProperties } from "../api/firebase"

export const requestProfile = () => {
    return dispatch => {
        dispatch(requestProfileStarted());

        GetUserProfile()
            .then(response => {
                setAnalyticsProperties({ customer: response.data.customer })
                dispatch(requestProfileSuccess(response.data));
            })
            .catch(error => {
                dispatch(requestProfileError(error.response?.data));
            });
    };
};

const requestProfileStarted = () => ({
    type: "REQUEST_PROFILE_STARTED"
});

const requestProfileSuccess = profile => ({
    type: "REQUEST_PROFILE_SUCCEESS",
    payload: profile
});

const requestProfileError = error => ({
    type: "REQUEST_PROFILE_ERRORR",
    payload: error
});

export const setTasksScope = scope => ({
    type: "SET_TASKS_FEED_SCOPE",
    payload: scope
});