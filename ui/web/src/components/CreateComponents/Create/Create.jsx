import React, { useContext } from 'react';
import { CreateContext } from '../CreateContext/CreateContext';
import { CreateSelections, GenreList, PlaylistMaker, ArtistList} from '../..';


const Create = () => {

    let { createOption, playlistLink } = useContext(CreateContext);

    const openPlaylist = () => {
        window.open(playlistLink, 'Spotify');
    }

    const instructions = () => {
        return <h2 className='instructions'>On this page, you can select as many {createOption}s as you like, and the app will automatically add them to your list of selected {createOption}s. 
            When you are done selecting, click the "Show Playlist" button below to see all the songs that will be added to your playlist.</h2>
    }

    //determines which createOption is selected and renders
    //appropriate component based on selection
    const displayCreateMenu = () => {
        if (createOption === 'genre') {
            return (
                <div className='create'>
                    <GenreList />
                    <PlaylistMaker />
                </div>
            );
        } else if (createOption === 'artist') {
            return (
                <div className='create'>
                    <ArtistList />
                    <PlaylistMaker />
                </div>
            );
        } else if (createOption === 'create') {
            return (
                <div className='create'>
                    <PlaylistMaker />
                </div>
            )
        } else if (createOption === 'success') {
            return (
                <div className = 'create'>
                    <p className='success'>Congrats! You just created your playlist. Click the button to view it in your browser.</p>
                    <button onClick={() => {openPlaylist()}}>View playlist</button>
                </div>
            )
        } else {
            return (
                <div className='createPage'>
                    <p>Use this page to create playlists based on all the genres present in your library or by one or multiple artists present in your library.</p>
                    <p>Make a selection to continue.</p>
                </div>
            );
        }
    }

    return (
        <div className='createPage'>
            <div className='createHead'>
                <h1>Create a playlist</h1>
                {instructions()}
                <CreateSelections />
            </div>
            {displayCreateMenu()}
        </div>
    );
}

export default Create;