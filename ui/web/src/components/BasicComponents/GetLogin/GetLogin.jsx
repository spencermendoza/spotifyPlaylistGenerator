import React, { useState, useEffect, useContext} from 'react';
import { LibraryContext } from '../../Context/LibraryContext';

const GetLogin = ({changeLogin, spotifyURL}) => {

    const [url, setUrl] = useState({});
    let { startup } = useContext(LibraryContext);

    useEffect(() => {
        setUrl(spotifyURL)
    }, [spotifyURL]);

    let newWindow;

    const openSpotify = () => {
        var width = 450,
            height = 730;
        let features = 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height
        newWindow = window.open(spotifyURL, 'Spotify', features);
        console.log('this is the url I am opening: ', spotifyURL)


        let timer = setInterval(function() {
            if (newWindow.closed) {
                clearInterval(timer);
                changeLogin();
                console.log('window closed')
                startup();
            }
        }, 1000);
    }

    const waitForURL = () => {
        if (url === undefined) {
            return (<p>We are generating your sign in link now</p>)
        } else {
            return (
                <button className='signInButton' onClick={() => openSpotify()}>
                    Log In
                </button>
            )
        }
    }

    return (
        waitForURL()
    )
}

export default GetLogin;