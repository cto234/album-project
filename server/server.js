const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 4000;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

console.log("Client ID:", clientId ? "Loaded" : "Missing");
console.log("Client Secret:", clientSecret ? "Loaded" : "Missing");
console.log("Playlist ID:", playlistId);


// Get Spotify access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Access token fetched");
    return response.data.access_token;
  } catch (err) {
    console.error("Error fetching access token:", err.response?.data || err.message);
    throw err;
  }
}


// Fetch playlist data
app.get("/albums", async (req, res) => {
  try {
    const token = await getAccessToken();
    console.log("Token:", token);
    console.log("Playlist ID:", playlistId);

    const { data } = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Playlist data received:", data);

    // map albums as before
    const albums = data.items.map((item) => {
      const album = item.track.album;
      return {
        title: album.name,
        image: album.images[0]?.url,
        link: album.external_urls.spotify,
        artist: item.track.artists.map((a) => a.name).join(", "),
      };
    });

    res.json(albums);
  } catch (error) {
    console.error("Failed to fetch from Spotify:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
