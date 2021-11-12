import React, { useReducer } from 'react';
import userContext from './userContext';
import userReducer from './userReducer';

const UserState = props => {
    const initialState = {
        firstname: "firstname",
        lastname: "lastname",
        email: "email@gmail.com",
        password: "password",
        bio: "bio",
        friends: [],
        notifications: [],
        receivedfriendrequests: [],
        sentfriendrequests: [],
        post: [],
        comments: [],
    }

    const [state, dispatch] = useReducer(userReducer, initialState);

    // TODO: Get User

    return (
        <userContext.Provider
        value={{
            firstname: state.firstname,
            lastname: state.lastname,
            email: state.email,
            password: state.password,
            bio: state.bio,
            friends: state.friends,
            notifications: state.notifications,
            receivedfriendrequests: state.receivedfriendrequests,
            sentfriendrequests: state.sentfriendrequests,
            post: state.post,
            comments: state.comments,
        }}>
            { props.children }
        </userContext.Provider>
    );
}

export default UserState;