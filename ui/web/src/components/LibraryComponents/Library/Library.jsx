import React, {  useContext, useState } from 'react';
import '../../../App.css';
import { LibraryContext } from '../../Context/LibraryContext';
import { LibraryList } from '../..';

const Library = () => {

    const { artistLibrary } = useContext(LibraryContext);
    const [display, setDisplay] = useState('list');


    //Checks if there are items in library in state, if there is shows number of tracks in library
    //and shows a button to view artists. If no artists in library in state, shows a <p>
    //that says 'please hold while I get your tracks'
    const waitingOnAPI = () => {
        if (artistLibrary.length > 0) {
            return <LibraryList />
        } else {
            return (<p>Please hold while I get your tracks!</p>);
        }
    };

    return waitingOnAPI();
}

export default Library;