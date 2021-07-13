import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlaylistList = ({currPlaylists, stateSetter}) => {

    const [playlists, setPlaylists] = useState([]);
    
    useEffect(() => {

        async function showPlaylists() {
            try {
                await axios.get('http://localhost:8888/playlists').then(response => {
                    stateSetter('playlists', response.data.items);
                    setPlaylists(response.data.items);
                })
            } catch (error) {
                console.log('there was an error on PlaylistList: ', error);
            }
        }

        if (currPlaylists.length > 0) {
            console.log('playlists passed through state: ', currPlaylists)
            setPlaylists(currPlaylists)
        } else {
            showPlaylists();
        }
    }, []);

    return (
        <div className='playlistContainer'>
            <h1>Here are your playlists!</h1>
            <ul className='playlists'>
                {playlists.map((item, i) => (
                    <li key={i}>
                        <p>Name: <b>{item.name}</b></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlaylistList;