import React, { useContext, useState } from 'react';
import { CreateContext } from '../CreateContext/CreateContext';
import { CreateSelections, GenreList, PlaylistMaker, ArtistList} from '../..';


const Create = () => {

    let { createOption, } = useContext(CreateContext);

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
                <CreateSelections />
            </div>
            {displayCreateMenu()}
        </div>
    );
}

export default Create;