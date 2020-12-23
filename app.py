from spotipy import Spotify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask
from flask_cors import CORS, cross_origin
app = Flask(__name__, static_folder='build/', static_url_path='/')
cors = CORS(app)

scope = "user-read-currently-playing user-read-playback-state user-read-recently-played"

sp = Spotify(auth_manager=SpotifyOAuth(scope=scope))


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/nowPlaying')
@cross_origin()
def getNowPlaying():
    nowPlaying = sp.currently_playing(additional_types="episode")
    if nowPlaying:
        nowPlaying["listening"] = True
        return nowPlaying
    else:
        return {"listening": False}

@app.route('/api/recentlyPlayed')
@cross_origin()
def getRecentlyPlayed():
    return sp.current_user_recently_played(limit=10)


if __name__ == "__main__":
    app.run()
