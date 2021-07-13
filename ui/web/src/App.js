import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import { LibraryProvider } from './components/Context/LibraryContext';
import {HomePage, Navbar} from './components';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'none',
            loggedIn: false,
        };
    }

    async componentDidMount() {
        let url;
        async function getURL() {
            const loginResponse = await axios({
                method: 'get',
                url: 'http://localhost:8888/login',
                withCredentials: true,
            });

            return loginResponse.data.body;
        };
        console.log('running getURL')
        url = await getURL();
        this.setState({
            url: url,
        });
    }

    changeLogin = () => {
        this.setState({
            loggedIn: true,
        });
    }

    render() {
        if(!this.state.loggedIn && this.state.url !== undefined) {
            return (
                <LibraryProvider loggedIn={this.state.loggedIn}>
                    <Navbar loggedIn={this.state.loggedIn} changeLogin={this.changeLogin} spotifyURL={this.state.url}/>
                    <div className = 'topLevel'>
                        <h1>Welcome to my Spotify playlist generator app!</h1>
                        <p>This app will allow you to generate playlists using songs already in your library. This assists with playlist generation for users who have lots of songs already in their library and automates the process of manually going through and adding songs to a playlist one by one.</p>
                        <h2>To get started, click the log in button above to generate a sign in link.</h2>
                    </div>
                </LibraryProvider>
            )
        } else {
            return (
                <LibraryProvider>
                    <Navbar loggedIn={this.state.loggedIn}/>
                    <div className='topLevel'>
                            <HomePage/>
                    </div>
                </LibraryProvider>
            )
        }

    };
};

export default App;