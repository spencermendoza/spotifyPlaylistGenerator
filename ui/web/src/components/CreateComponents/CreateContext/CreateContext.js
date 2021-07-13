import React, { Component, useContext } from 'react';
import { LibraryContext } from '../../Context/LibraryContext'

const CreateContext = React.createContext();
const { Provider, Consumer } = CreateContext;

class CreateProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            createOption: '',
            list: [],
            selectedList: [],
            artistList: [],
            trackList: [],
        }
    }

    //just state setter functions to make setting state quick
    setCreateOption = (selection) => {
        console.log('creating by: ', selection);
        this.setState({
            createOption: selection,
        });
    };

    setList = (newList) => {
        this.setState({
            list: newList,
        });
    };

    setSelectedList = (newList) => {
        this.setState({
            selectedList: newList,
        });
    };

    setArtistList = (newList) => {
        this.setState({
            artistList: newList,
        });
    };

    setTrackList = (newList) => {
        this.setState({
            trackList: newList,
        });
    };

    //toggles the items on or off the given list
    changeOption = (option, checkList) => {
        let tempList = checkList;
        if (tempList.includes(option)) {
            const index = tempList.indexOf(option);
            if (index > -1) {
                console.log('removing option: ', option)
                tempList.splice(index, 1);
            }
        } else {
            console.log('adding option: ', option)
            tempList.push(option);
        }
        return tempList;
    }

    //supposed to toggle items off of the artistList in state
    //but it's not working and idk why
    changeArtistOption = (option) => {
        let tempList = this.state.artistList;
        if (tempList.includes(option)) {
            const index = tempList.indexOf(option);
            if (index > -1) {
                console.log('removing this from your artistList: ', option);
                tempList.splice(index, 1);
            }
        }
        this.setArtistList(tempList);
    }

    //clears the selected and artist lists to restart the process
    clearSelection = () => {
        if (this.state.createOption === 'create') {
            this.setCreateOption('');
        };
        this.setSelectedList([]);
        this.setArtistList([]);
    }

    //completely resets state
    resetState = () => {
        this.setState({
            createOption: '',
            list: [],
            selectedList: [],
            artistList: [],
        })
    }

    //this function figures out what the createOption was set to before it
    //was set to 'create'. Then restores the progress back to that point
    goBack = () => {
        if (this.state.selectedList.length > 0) {
            if (typeof this.state.selectedList[0] === 'string') {
                this.setCreateOption('genre');
                this.setArtistList([]);
            } else {
                this.setCreateOption('artist');
                this.setArtistList([]);
            }
        } else {
            this.resetState();
        }
    }

    //pulls genreList out of the list of provided artists and then finds all the artists
    //in library that match the genres on the list
    associateArtists = (artistList, artistLibrary) => {
        console.log('associating artists')
        let genreCompiler = this.compileGenres(artistList);
        let newArtistList = this.findArtistsByGenre(genreCompiler, artistLibrary);
        artistList.forEach(artist => {
            if (newArtistList.includes(artist)) {
                return;
            } else {
                newArtistList.push(artist);
            }
        })
        let sortedList = newArtistList.sort((a, b) => (a.name > b.name) ? 1 : -1);
        return sortedList;
    }

    //accepts a list of artists and returns the genres
    //associated with those artists
    compileGenres = (artistList) => {
        let genreCompiler = [];
        artistList.forEach(artist => {
            artist.genres.forEach(genre => {
                if (!genreCompiler.includes(genre)) {
                    genreCompiler.push(genre);
                }
            })
        })
        genreCompiler.sort();
        return genreCompiler;
    }

    //should take a list of genres and a playlist name and return a list of matching artists
    findArtistsByGenre = (genreList, artistLibrary) => {
        let artistList = [];
        genreList.forEach(genre => {
            artistLibrary.forEach(artist => {
                if (artist.genres.includes(genre)) {
                    artistList.push(artist);
                }
            })
        })
        let uniqueArtists = [...new Set(artistList)];
        return uniqueArtists;
    }

    //accepts an array of artists and puts all of that 
    //artists saved tracks into an array
    pullTracksFromArtists = (array) => {
        let tempList = [];
        array.forEach(artist => {
            artist.music.forEach(album => {
                album.tracks.forEach(track => {
                    tempList.push(track);
                })
            })
        })
        let trackList = [...new Set(tempList)];
        return trackList;
    }

    //accepts an array of track objects and creates an 
    //array of URIs from the tracks
    pullURIFromTracks = (array) => {
        let URIList = [];
        array.forEach(track => {
            URIList.push(track.uri);
        })
        return URIList;
    }

    render() {
        return (
            <Provider
                value = {{
                    ...this.state,
                    setCreateOption: this.setCreateOption,
                    setList: this.setList,
                    setSelectedList: this.setSelectedList,
                    setArtistList: this.setArtistList,
                    setTrackList: this.setTrackList,
                    changeOption: this.changeOption,
                    clearSelection: this.clearSelection,
                    associateArtists: this.associateArtists,
                    compileGenres: this.compileGenres,
                    findArtistsByGenre: this.findArtistsByGenre,
                    pullTracksFromArtists: this.pullTracksFromArtists,
                    changeArtistOption: this.changeArtistOption,
                    pullURIFromTracks: this.pullURIFromTracks,
                    goBack: this.goBack,
                }}
            >{this.props.children}</Provider>
        )
    }
}

export { CreateContext, CreateProvider, Consumer as CreateConsumer };