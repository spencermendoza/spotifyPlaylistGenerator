import React, { useState, useEffect, useContext } from 'react';
import { LibraryContext } from '../../Context/LibraryContext';

const UserInfo = () => {

    const { user } = useContext(LibraryContext);

    const showInfo = (user) => {
        return (
            <ul className='infoList'>
            <li><b>Username:</b> {user.display_name}</li>
                <li><b>Country:</b> {user.country}</li>
                <li><b>Email:</b> {user.email}</li>
                <li><b>Subscription Type:</b> {user.product}</li>
            </ul>
        )
    }

    return (
        <div className='userInfo'>
            <h1>{user.display_name}:</h1>
            {showInfo(user)}
        </div>
    )
}

export default UserInfo;