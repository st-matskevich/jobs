export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ('UPDATE_PROFILE'):
            return { ...state, profile: action.payload }
        default:
            return state;
    }
}

const initialState = {
    profile: null
}