import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

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
        api: '',
    }

    componentDidMount() {
        if (process.env.NODE_ENV === 'development') {
            console.log('this is the development build ')
            this.setState({
                api: 'http://localhost:8888/',
            })
        } else if (process.env.NODE_ENV === 'production') {
            console.log('this is the production build ')
            this.setState({
                api: 'mendoza-playlist.herokuapp.com/',
            })
        } else {
            console.log('there was some sort of error determining if this is prod or dev build')
        }
    }

    startup = async () => {
        console.log('api: ', this.state.api)
        console.log('cookies: ', document.cookie)
        let music = await this.getMusic();
        let user = await this.getUser();
        this.setContextState('artistLibrary', music.data.sort((a, b) => (a.name > b.name) ? 1 : -1));
        this.setContextState('user', user.data)
        console.log('user: ', this.state.user)
    }

    //axios request to get music
    getMusic = () => {
        console.log('getting your music now');
        let options = {
            method: 'get',
            url: this.state.api + 'library',
            withCredentials: true,
        };
        console.log('music url: ', options.url)
        return axios(options);
    }

    //axios request to get user
    getUser = () => {
        console.log('getting user info now')
        let options = {
            method: 'get',
            url: this.state.api + 'userinfo',
            withCredentials: true,
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
    createPlaylist = async (array, playlistName) => {
        console.log('i am about to create a playlist using this name: ', playlistName)
        console.log('just checking the array: ', array);
        let options = {
            method: 'post',
            url: this.state.api + 'newplaylist',
            data: {
                trackList: array,
                playlistName: playlistName,
                user: this.state.user.id,
                withCredentials: true,
            }
        }
        console.log(document.cookie)
        return await axios(options);
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