import React, { useContext } from 'react';
import '../../../App.css';
import { LibraryContext } from '../../Context/LibraryContext';
import { ArtistItem } from '../..';

const LibraryList = () => {
    const { artistLibrary } = useContext(LibraryContext);

    return (
        <div className='libraryPage'>
            <h1>Here is your library:</h1>
            <p>You have {artistLibrary.length} artists in your library</p>
            <table className='artistList'>
                <thead>
                    <tr className='artistListHead'>
                        <th></th>
                        <th>Artist</th>
                        <th>Saved Albums</th>
                        <th>Saved Tracks</th>
                    </tr>
                </thead>
                <tbody className='artistListBody'>
                    {artistLibrary.map(artist => (
                            <ArtistItem artist={artist} key={artist.name}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LibraryList;