import { GET_USER } from '../types';

const contactReducer = (state, action) => {
    switch (action.type) {
        case GET_USER:
            return {
                ...state, //TODO: might not need, might not work as intended
                firstname: state.firstname,
                lastname: state.firstname,
                email: state.email,
                password: state.password,
                bio: state.bio,
                friends: state.friends,
                notifications: state.notifications,
                receivedfriendrequests: state.receivedfriendrequests,
                sentfriendrequests: state.sentfriendrequests,
                post: state.post,
                comments: state.comments,
            };
        default:
            break;
    }
}

export default contactReducer;