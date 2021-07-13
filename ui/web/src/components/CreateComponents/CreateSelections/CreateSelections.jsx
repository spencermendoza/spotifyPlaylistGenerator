import React, { useContext } from 'react';
import { LibraryContext } from '../../Context/LibraryContext';
import { CreateContext } from '../CreateContext/CreateContext';

const CreateSelections = () => {

    let { artistLibrary } = useContext(LibraryContext);
    let { 
        createOption,
        selectedList,
        artistList,
        setCreateOption,
        setList,
        setSelectedList,
        compileGenres,
        findArtistsByGenre
    } = useContext(CreateContext);


    const beginCreating = (selection, newList) => {
        //create => something else
        if (createOption === 'create' && selection !== 'create') {
            //create => genre
            if (selection === 'genre') {
                console.log('create option switched from create to genre')
                //genre => create => genre
                if (selectedList.every(i => (typeof i === 'string'))) {
                    console.log('create option used to be genre')
                    setCreateOption(selection);
                //artist => create => genre
                } else {
                    console.log('create option used to be artist')
                    let tempList = selectedList;
                    setSelectedList(compileGenres(tempList));
                    setCreateOption(selection);
                    setList(newList);
                }
            //create => artist
            } else if (selection === 'artist') {
                console.log('create option switched from create to artist')
                //artist => create => artist
                if (selectedList.every(i => (typeof i === 'object'))) {
                    console.log('create option used to be artist')
                    setCreateOption(selection);
                //genre => create => artist
                } else {
                    console.log('create option used to be genre')
                    setSelectedList(artistList);
                    setCreateOption(selection);
                    setList(artistLibrary);
                }
            }
        //artist => genre
        } else if (createOption === 'artist' && selection === 'genre') {
            let tempList = selectedList;
            setSelectedList(compileGenres(tempList));
            setCreateOption(selection);
            setList(newList);
        //genre => artist
        } else if (createOption === 'genre' && selection === 'artist') {
            let tempList = selectedList;
            setSelectedList(findArtistsByGenre(tempList, artistLibrary))
            setCreateOption(selection);
            setList(newList);
        } else if (createOption === selection) {
            return;
        //any other cases just resets
        } else {
            setList(newList);
            setCreateOption(selection);
            setSelectedList([]);
        }
    }

    return (
        <div className="createSelections">
            <button onClick={() => beginCreating('genre', compileGenres(artistLibrary))}>Create by genre</button>
            <button onClick={() => beginCreating('artist', artistLibrary)}>Create by artist</button>
        </div>
    );
}

export default CreateSelections;