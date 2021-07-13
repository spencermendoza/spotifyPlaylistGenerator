import React, { Component } from 'react';
import axios from 'axios';

const LibraryContext = React.createContext();
const { Provider, Consumer } = LibraryContext;

class LibraryProvider extends Component {
    state = {
        artistLibrary: [],
        user: {},
        displayOptions: [
            'My Library',
            'Create',
            'User Info',
        ],
        display: 'Base',
        loggedIn: this.props.loggedIn,
    }

    startup = async () => {
        let music = await this.getMusic();
        let user = await this.getUser();
        this.setContextState('artistLibrary', music.data.sort((a, b) => (a.name > b.name) ? 1 : -1));
        this.setContextState('user', user.data)
    }

    //axios request to get music
    getMusic = () => {
        console.log('getting your music now');
        let options = {
            method: 'get',
            url: 'http://localhost:8888/library',
        };
        return axios(options);
    }

    //axios request to get user
    getUser = () => {
        console.log('getting user info now')
        let options = {
            method: 'get',
            url: 'http://localhost:8888/userinfo',
        };
        return axios(options);
    }

    //just an easy function that allows me to set different context state values
    setContextState = (stateItem, itemValue) => {
        this.setState({
            [stateItem]: itemValue,
        });
    }

    //takes the array of artists and holds it for now
    //takes the playlist name and runs it through the api
    //to create a playlist with that name
    createPlaylist = (array, playlistName) => {
        console.log('i am about to create a playlist using this name: ', playlistName)
        console.log('just checking the array: ', array);
        axios({
            method: 'post',
            url: 'http://localhost:8888/newplaylist',
            data: {
                trackList: array,
                playlistName: playlistName,
                user: this.state.user.id,
            }
        })
    }

    render() {
        return (
            <Provider 
                value ={{
                    ...this.state,
                    startup: this.startup,
                    setContextState: this.setContextState,
                    createPlaylist: this.createPlaylist,
                }}
            >{this.props.children}</Provider>
        )
    }
}

export { LibraryContext, LibraryProvider, Consumer as LibraryConsumer };