import React, { useContext } from 'react';
import UserContext from '../../context/user/userContext';

export const UserPage = () => {
    const userContext = useContext(UserContext);

    const { firstname, lastname } = userContext;

    return (
        <div>
            {firstname} {lastname}
        </div>
    );
}

export default UserPage;