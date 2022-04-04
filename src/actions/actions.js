import { GetUserProfile } from "../api/backend"

export const requestProfile = () => {
    return dispatch => {
        dispatch(requestProfileStarted());

        GetUserProfile()
            .then(response => {
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