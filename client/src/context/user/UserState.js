import React, { useReducer } from 'react';
import axios from 'axios';
import userContext from './userContext';
import userReducer from './userReducer';
import { GET_USER } from '../types';

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

    // Get User
    const getUser = async () => {
        try {
            const res = await axios.get('/api/auth');

            dispatch({
                type: GET_USER,
                payload: res.data
            });
        } catch (err) {
            //TODO handle this better by dispatching with type ERROR
            throw err;
        }
    }

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
            getUser 
        }}>
            { props.children }
        </userContext.Provider>
    );
}

export default UserState;