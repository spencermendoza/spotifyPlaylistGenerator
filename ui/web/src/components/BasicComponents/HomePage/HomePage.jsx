import React, { useContext } from 'react';
import { LibraryContext } from '../../Context/LibraryContext';
import { UserInfo, Library, Create } from '../../';
import { CreateProvider } from '../../CreateComponents/CreateContext/CreateContext';

const HomePage = () => {

    let { artistLibrary, display } = useContext(LibraryContext);

    //determines which component to display based on the value stored in state
    const showComponent = () => {
        if (display === 'My Library') {
            return <Library />
        } else if (display === 'Create') {
            return <Create />
        } else if (display === 'User Info') {
            return <UserInfo />
        } else if (display === 'Base') {
            return (
                <div className='instructions'>
                    <h1>Ok, let's get to work!</h1>
                    <p>Make a selection above to get started</p>
                </div>
            )
        }
    }

    const waitForLibrary = () => {
        if (artistLibrary.length > 0) {
            return (
                <div className='homeDiv'>
                    <CreateProvider>{showComponent()}</CreateProvider>
                </div>
            );
        } else {
            return (
                <div className='homeDiv'>
                    <h3>Please hold while I retrieve your music library!</h3>
                </div>
            )
        }
    }

    return waitForLibrary()
};


export default HomePage;