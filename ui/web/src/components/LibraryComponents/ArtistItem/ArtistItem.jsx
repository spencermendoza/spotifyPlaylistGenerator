import React, { useState, useEffect, useContext, } from 'react';
import { LibraryContext } from '../../Context/LibraryContext';
import { CreateContext } from '../../CreateComponents/CreateContext/CreateContext';
import { TrackList } from '../..';
import '../../../App.css';
import icon from '../../../img/Spotify_Icon_RGB_Black.png';

const ArtistItem = ({artist}) => {
    // console.log('the artist: ', artist)
    let { name, music, images } = artist;

    let { pullTracksFromArtists, } = useContext(CreateContext);

    //just a number tied to the number of tracks a given artist has
    let [numOfTracks, setNumOfTracks] = useState(0);
    //just a bool to determine whether or not to display the full
    //track list the given artist has
    let [displayArtistDetails, setDisplayArtistDetails] = useState(false);

    //all this does is function like componentDidMount and gets the
    //function formatArtist() to fire when mounted
    useEffect(() => {
        formatArtist();
    }, [artist]);

    //adds up the number of total tracks an artist has in the library
    //and also determines if there are images on the artist object
    //and if not it sets the image to the Spotify logo
    const formatArtist = () => {
        console.log('music: ', music)
        let num = 0;
        music.forEach(album => {
            num = num + album.tracks.length;
        })
        setNumOfTracks(num)
        console.log(numOfTracks)
        if (images.length === 0) {
            images.push({url: icon});
        }
    }

    //the function that holds the rest of the artist details and uses
    //the displayArtistDetails state value to determine whether or
    //not to show itself
    const showArtistDetails = () => {
        let trackList = pullTracksFromArtists([artist]);
        if (displayArtistDetails) {
            console.log('artists track list: ', trackList)
            return (
                <tr className='singleArtist' onClick={() => {setDisplayArtistDetails(!displayArtistDetails)}}>
                <td><img className='artistImage' src={images[0] ? images[0].url : icon} /></td>
                    <TrackList list={trackList} />
                </tr>
            )
        } else {
            return (
                <tr className='singleArtist' onClick={() => {setDisplayArtistDetails(!displayArtistDetails)}}>
                    <td><img className='artistImage' src={images[0] ? images[0].url : icon} /></td>
                    <td><b>{name}</b></td>
                    <td>{music.length}</td>
                    <td>{numOfTracks}</td>
                </tr>
            );
        }
    }

    return showArtistDetails();
    
}

export default ArtistItem;