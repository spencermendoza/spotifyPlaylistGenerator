require('dotenv').config();
var express = require('express');
const cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const path = require('path');

//handles only the authentication and holds tokens
var apiAuth = require('./apiAuthentication');
//handles all api data requests. needs token from apiAuth to work (i think)
var apiRequests = require('./apiRequests');

//handles the formatting of a user's library
var libraryFormatter = require('./formatLibrary.js');

var app = express();

app.use(cookieParser());
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  // Add headers
app.use(function (req, res, next) {

//   // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', req.headers.origin);

//   // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
  next();
});
// app.get('/', (req, res) => {res.send('Hello from Express!')});
// console.log('process: ', process.env.NODE_ENV)

app.get('/login', function(req, res) {
  console.log('hitting login endpoint')
  var { stateKey, returnedState, url } = apiAuth.getLoginURL();
  res.clearCookie();
  res.cookie(stateKey, returnedState);
  res.send({body: url});
});

app.get('/callback', async function(req, res) {
  console.log('received callback from spotify API')
  console.log('referencing api auth...');
  let user = await apiAuth.getAuthDetails(req);
  if (user === 'state_mismatch') {
    res.redirect('/#' + 
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.send(user);
  }
});

app.get('/userinfo', async function(req, res) {
  console.log('should be getting user info now')
  let token = await apiAuth.authenticate(req.cookies.spotify_auth_state)
  apiRequests.getData(token, 'user').then(response => {
    userInfo = response;
      res.send(userInfo);
    });
});

app.get('/playlists', async function(req, res) {
  let token = await apiAuth.authenticate(req.cookies.spotify_auth_state)
    apiRequests.getData(token, 'playlists').then(response => {
      res.send(response);
    });
});

app.get('/library', async function(req, res) {
  let token = await apiAuth.authenticate(req.cookies.spotify_auth_state)
  let library = await apiRequests.getData(token, 'library');
  let formattedLibrary = await libraryFormatter.formatLibrary(library.items, token);
  res.send(formattedLibrary);
});

app.post('/newplaylist', async function(req, res) {
  let token = await apiAuth.authenticate(req.cookies.spotify_auth_state)
  let trackList = req.body.trackList;
  let playlistName = req.body.playlistName;
  let userId = req.body.user;
  let answer = await apiRequests.createPlaylist(token, playlistName, userId);
  await apiRequests.addToPlaylist(token, answer.id, trackList);
  console.log('newPlaylist: ', answer)
  res.send(answer.external_urls.spotify);
});

if (process.env.NODE_ENV === 'production') {

  app.use(express.static('ui/web/build'));
  
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })
  
}








// console.log('listening on port 8888');
app.listen(process.env.PORT || 8888);