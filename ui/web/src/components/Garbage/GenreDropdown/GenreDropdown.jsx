import React, { useContext, useState, useRef, useEffect } from 'react';
import { LibraryContext } from '../Context/LibraryContext';
import './dropdown.css';


const GenreDrop = () => {

    let { artistLibrary, findArtists } = useContext(LibraryContext);
    const dropdownRef = useRef(null);
    const [genreList, setGenreList] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [playlistName, setPlaylistName] = useState();

    const changeIsActive = () => setIsActive(!isActive);

    useEffect(() => {
        let genreList = [];
        artistLibrary.forEach(artist => {
            artist.genres.forEach(genre => {
                if (!genreList.includes(genre)) {
                    genreList.push(genre)
                }
            })
        })
        genreList.sort();
        setGenreList(genreList);
    }, []);

    useEffect(() => {
        const pageClickEvent = (e) => {
            let type = e.target.type;
            if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target) && type !== 'checkbox') {
                setIsActive(!isActive);
            }
        }

        if (isActive) {
            window.addEventListener('click', pageClickEvent)
        }

        return () => {
            window.removeEventListener('click', pageClickEvent)
        }
    }, [isActive]);

    const changeOption = (option) => {
        let tempGenreList = [];
        if (selectedGenres.length > 0) {
            tempGenreList = selectedGenres.map(genre => (
                genre
            ));
        }
        if (tempGenreList.includes(option.genre)) {
            const index = tempGenreList.indexOf(option.genre);
            if (index > -1) {
                tempGenreList.splice(index, 1);
            }
        } else {
            tempGenreList.push(option.genre)
        }
        setSelectedGenres([...tempGenreList])
    }

    const clearSelection = () => {
        setSelectedGenres([])
    };

    const printList = () => {
        findArtists(selectedGenres, playlistName);
    }

    //Checkbox component that just is each li on the list with a checkbox next to it
    const Checkbox = (genre, key) => {
        var checked = null;
        if (selectedGenres.includes(genre.genre)) {
            checked = true;
        }
        return (
            <li key={key}>
                <label for='input'>
                    <input type='checkbox' checked={checked} value={genre.genre} onChange={e =>changeOption(genre)} />{genre.genre}
                </label>
            </li>
        )
    }

    return (
        <div className='top'>
            <div className='menu-container'>
                <button onClick={changeIsActive} className='menu-trigger'>
                    <span>Show genres</span>
                </button>
                <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
                    <ul>
                        {genreList.map((genre, i) => (
                            <Checkbox genre={genre} key={i}/>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className='selectedGenres'>
                <p>Here are your selected genres. Clicking 'Create Playlist' below will generate a playlist from artists in your library based on the genres you selected.</p>
                <form className='name-playlist'>
                    <label>Name your playlist!</label>
                    <input type='text' name='Name your playlist' onChange={e => setPlaylistName(e.target.value)}></input>
                </form>
                <button className='create-playlist' onClick={printList}>
                    <span>Create Playlist</span>
                </button>
                <button className='clear-list' onClick={clearSelection}>
                    <span>Clear selected list</span>
                </button>
                <ul className='selected-list'>
                    {selectedGenres.map((genre, i) => (
                        <li key={i}>{genre}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default GenreDrop;

