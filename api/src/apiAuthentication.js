require('dotenv').config();
var querystring = require('querystring');
const axios = require('axios');
var mongo = require('./databaseFunctions');
// const { AutoEncryptionLoggerLevel } = require('mongodb');
// const { response } = require('express');
// var request = require('request');
// const cors = require('cors');
// var cookieParser = require('cookie-parser');
// const path = require('path');

const client_id = '56cba1007de442ce9f5b05ffc57b1d96'; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = prodOrDev(); //your redirect_uri

function prodOrDev() {
    if (process.env.NODE_ENV === 'development') {
        console.log('---------------------this is a dev env-------------------')
        return 'http://localhost:8888/callback';
    } else if (process.env.NODE_ENV === 'production') {
        console.log('-----------------------this is a prod env--------------------')
        return 'https://mendoza-playlist.herokuapp.com/callback';
    } else {
        console.log('there was an error determining if this is a prod or dev env in apiAuth')
    }
};

//session details
// var accessToken = '';
// var refreshToken = '';
// var user = {};
var state = generateRandomString(16);  
var scopes = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read playlist-modify-public playlist-modify-private';


// var sessionDetails = {
//   accessToken: '',
//   refreshToken: '',
//   authOptions: {},
//   userId: '',
//   state: '',
// }

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

function getLoginURL() {
    const url = createURL(scopes, state);

    var returnOptions = {
        stateKey: stateKey,
        returnedState: state,
        url: url,
    }

    return returnOptions;
};

function createURL(scopes, state) {
    return 'https://accounts.spotify.com/en/authorize?' + 
    querystring.stringify({
        client_id: client_id,
        response_type: 'code',
        scope: scopes,
        redirect_uri,
        state: state,
    });
};

async function getAuthDetails(req) {
    console.log('retrieving authentication options...')

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        return 'state_mismatch';
    } else {
        let form = querystring.stringify({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        });
        let authOptions = {
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: form,
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization':'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
            },
        };

        // console.log('authOptions: ', authOptions)

        let response = await axios(authOptions).catch(error => {
            if (error) {
                console.log('there was an error in apiAuth: ', error)
            }
        });
        
        var userDetails = {
            userId: '',
            accessToken: '',
            refreshToken: '',
            cookie: '',
        }
        userDetails.accessToken = response.data.access_token;
        // console.log('this is the access token in apiAuth: ', response.data.access_token);
        userDetails.refreshToken = response.data.refresh_token;

        let getUserOptions = {
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + userDetails.accessToken,
            },
        }

        let returnedUser = await axios(getUserOptions).catch(error => {
            if (error) {
                console.log('the other shit worked but now I cant get user options: ', error);
            }
        })
        userDetails.userId = returnedUser.data.href;
        userDetails.cookie = state;
        user = returnedUser.data;
        mongo.doesUserExist(userDetails);
        return user;
    }
}

function showToken() {
    return accessToken;
}

async function authenticate(cookie) {
    let token = await mongo.getToken(cookie);
    // console.log('this is the token returned by mongo: ', token)
    return token;
}

module.exports = {
    getLoginURL: getLoginURL,
    getAuthDetails: getAuthDetails,
    showToken: showToken,
    authenticate: authenticate,
}