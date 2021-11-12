import React, { useEffect, useContext } from 'react';
import UserContext from '../../context/user/userContext';

export const UserPage = () => {
    const userContext = useContext(UserContext);

    const { firstname, lastname } = userContext;

    useEffect(() => {
        userContext.getUser();
        //eslint-disable-next-line
    }, []);

    return (
        <div>
            {firstname} {lastname}
        </div>
    );
}

export default UserPage;