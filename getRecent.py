#!/usr/bin/env python
# coding: utf-8

import os
import requests
from collections.abc import MutableMapping
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from pymongo import MongoClient
from datetime import datetime, timedelta


def flatten(d, parent_key=''):
    items = []
    for k, v in d.items():
        new_key = parent_key + '_' + k if parent_key else k
        if isinstance(v, MutableMapping):
            items.extend(flatten(v, new_key).items())
        else:
            new_key = new_key.replace('#', '')
            items.append((new_key, v))
    return dict(items)


def get_fields(track):
    if 'streamable' in track:
        del track['image']
        del track['streamable']
    flattened = flatten(track)
    for key, val in flattened.items():
        if val == '':
            flattened[key] = None
    return flattened


def get_track_URI(artist_name, track_name):
    query = track_name + ' ' + artist_name
    res = sp.search(query, type="track")
    for i in res['tracks']['items']:
        if (i['artists'][0]['name'] == artist_name) and (i['name'] == track_name):
            return i['uri']
        else:
            try:
                return res['tracks']['items'][0]['uri']
            except:
                return None


def fetch_recent_tracks(recent_track_uts, page=1):
    api_url = 'http://ws.audioscrobbler.com/2.0/'
    headers = {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
    }
    payload = {
        'user': 'devajji',
        'api_key': os.getenv('LASTFM_API_KEY'),
        'method': 'user.getRecentTracks',
        'format': 'json',
        'page': page,
        'from': recent_track_uts
    }
    return requests.get(api_url, headers=headers, params=payload).json()


def save_recent_tracks():
    username = os.getenv("MONGODB_USERNAME")
    password = os.getenv("MONGODB_PASSWORD")
    client = MongoClient(f'mongodb+srv://{username}:{password}' + 
                        "@cluster0.eip5b.mongodb.net/retryWrites=true&w=majority")
    db = client.Songs
    collection = db['All Songs']

    recent_track_uts = int(collection.find().sort([("uts", -1)]).limit(1)[0]["uts"]) + 1

    page = fetch_recent_tracks(recent_track_uts)
    rows = []
    for track in page['recenttracks']['track']:
        fields = get_fields(track)
        track_name = fields['name']
        album_name = fields['album_text']
        artist_name = fields['artist_text']
        track_URI = get_track_URI(artist_name, track_name)        
        track_features = sp.track(track_id=track_URI)
        audio_features = sp.audio_features(track_URI)[0]
        try:
            date_uts = int(fields["date_uts"])
        except KeyError:
            continue
        rows.append(
            {
                'uts': date_uts,
                'artist_name': artist_name,
                'album_name': album_name,
                'track_name': track_name,
                'track_uri': track_URI,
                'popularity': track_features["popularity"],
                'preview_url': track_features["preview_url"],
                'danceability': audio_features['danceability'],
                'energy': audio_features['energy'],
                'key': audio_features['key'],
                'loudness': audio_features['loudness'],
                'mode': audio_features['mode'],
                'speechiness': audio_features['speechiness'],
                'acousticness': audio_features['acousticness'],
                'instrumentalness': audio_features['instrumentalness'],
                'liveness': audio_features['liveness'],
                'valence': audio_features['valence'],
                'tempo': audio_features['tempo'],
                'duration_ms': audio_features['duration_ms'],
                'time_signature': audio_features['time_signature'],
                'image_large': track_features["album"]["images"][0]["url"],
                'image_medium': track_features["album"]["images"][1]["url"],
                'image_small': track_features["album"]["images"][2]["url"]
            }
        )
    try:
        result = collection.insert_many(rows)
    except TypeError:
        print("No new tracks to add.")
    print(f"Saved! {len(rows)} tracks")


if __name__ == "__main__":
    scope = "user-read-currently-playing user-read-playback-state user-read-recently-played"
    sp = Spotify(auth_manager=SpotifyOAuth(scope=scope))
    save_recent_tracks()
