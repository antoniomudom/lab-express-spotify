require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => res.render('index'));

//ruta de búsqueda
app.get("/artist-search", (req, res, next) => {
  console.log(req.query);
  const artistName = req.query.id;
  console.log("artistName:",artistName)
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log("buscando artista", data.body);
      res.render("artist-search-results.hbs", { data: data.body});
    })
    .catch((error) => {
      console.log("No se encontró ningún artista", error);
      res.render("error");
    });
});
app.get("/artist-search/:id",(req,res,next)=>{
  const artistId = req.params.id;
  spotifyApi
  .getArtistAlbums(artistId)
  .then((data) => {
    console.log("hola artistaobteniendo albumes",data.body);
    res.render("albums.hbs",{ albums: data.body.items});
  })
  .catch((error) => {
    console.log("no está el álbum", error);
    res.render("error");

})
});
app.get("/tracks/:id", (req, res, next) => {
  const albumId = req.params.id;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log("Aquí están las canciones", data.body);
      res.render("tracks.hbs", { tracks: data.body.items });
    })
    .catch((error) => {
      console.log("No se encontraron las canciones", error);
      res.render("error");
    });
});

  



app.listen(4004, () => console.log('My Spotify project running on port 4004 🎧 🥁 🎸 🔊'));
