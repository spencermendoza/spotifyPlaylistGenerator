import React, { useContext, useState, useEffect, useRef } from 'react';
import { CreateContext } from '../CreateContext/CreateContext';
import { LibraryContext } from '../../Context/LibraryContext';
import { CreateButtons, TrackList } from '../..';


const PlaylistMaker = () => {

    const {
        createOption,
        selectedList,
        artistList,
        trackList,
        setSelectedList,
        setTrackList,
        changeOption,
        pullURIFromTracks,
    } = useContext(CreateContext);

    const { createPlaylist } = useContext(LibraryContext);

    useEffect(() => {
        setWorkingList(artistList);
    }, [artistList]);

    const playlistNameRef = useRef(null);

    //literally just to toggle the display mode when createOption is set to 'genre'
    const [display, setDisplay] = useState('default-genre');
    const [workingList, setWorkingList] = useState(artistList)

    //works with the display state value above to toggle
    //back and forth the display mode when creating by genre
    const showList = () => {
        if (display === 'default-genre') {
            return (
                <ul className='playlistMakerList'>
                    {selectedList.sort().map((genre, key) => (
                        <li key={key} onClick={e => {setSelectedList(changeOption(genre, selectedList))}}>{genre}</li>
                    ))}
                </ul>
            );
        } else if (display === 'default-artist') {
            return (
                <ul className='playlistMakerList'>
                    {artistList.sort((a, b) => (a.name > b.name) ? 1 : -1).map((artist, key) => (
                        <li key={key}>{artist.name}</li>
                    ))}
                </ul>
            )
        }
    }

    //starts the process of making a playlist.
    const beginPlaylist = () => {
        let name = playlistNameRef.current.value;
        if (!name) {
            console.log('you need a name!')
            alert('You need to name your playlist first!')
            playlistNameRef.current.value = 'GIVE ME A NAME FIRST'
        } else {
            let trackURIs = pullURIFromTracks(trackList);
            createPlaylist(trackURIs, name);
        }
    }

    const removeItem = (item) => {
        setTrackList(changeOption(item, trackList))
    }

    //This is what is returned if 'createSelection' is set to 'genre'
    const createByGenre = () => {
        return (
            <div className='playlistMaker'>
                <p>Here are your selected genres so far:</p>
                {showList()}
                <CreateButtons display={display} setDisplay={setDisplay}/>
            </div>
        )
    }

    //This is what is returned if 'createSelection' is set to 'artist'
    const createByArtist = () => {
        return (
            <div className='playlistMaker'>
                <p>Here are your selected artists so far:</p>
                <ul className='playlistMakerList'>
                    {selectedList.sort((a, b) => (a.name > b.name) ? 1 : -1).map((artist, key) => (
                        <li key={key} onClick={e => {setSelectedList(changeOption(artist, selectedList))}}>{artist.name}</li>
                    ))}
                </ul>
                <CreateButtons />
            </div>
        )
    }

    //This is what is returned if 'createSelection' is set to 'create'
    const create = () => {
        return (
            <div className='playlistMaker'>
                <p>Here is the current version of your playlist:</p>
                <TrackList list={trackList} remove={removeItem}/>
                <form className='name-playlist'>
                    <label>Name your playlist:</label>
                    <input type='text' name='Name your playlist' ref={playlistNameRef}></input>
                </form>
                <b>Clicking 'Create' below will create a playlist with these artists</b><br></br>
                <CreateButtons beginPlaylist={beginPlaylist}/>
            </div>
        )
    }

    //conditional rendering based on if user chose to create by genre
    //or create by artist, or begin the create stage
    const genreOrArtist = () => {
        if (createOption === 'artist') {
            return createByArtist();
        } else if (createOption === 'genre') {
            return createByGenre();
        } else if (createOption === 'create') {
            return create();
        }
    }

    return genreOrArtist();
}

export default PlaylistMaker;