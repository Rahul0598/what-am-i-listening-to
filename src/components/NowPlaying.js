import React, {useState, useEffect} from 'react';
import {getPlayback} from '../data/getPlayback';
import RecentlyPlayed from './RecentlyPlayed';
import SongCard from './SongCard';


const NowPlaying = () => {
    const [nowPlaying, updateNowPlaying] = useState(0);

    useEffect(() => {
        const api_url = '/api/nowPlaying'
        getPlayback(updateNowPlaying, api_url);
        const interval = setInterval(() => { getPlayback(updateNowPlaying, api_url) }, 60000);
        return () => clearInterval(interval);
    }, []);

    const buildData = () => {
        const  { error } = nowPlaying;
        if(!nowPlaying?.listening){
            return (
                <div>
                    <RecentlyPlayed />
                </div>
            )
        }

        const track = nowPlaying?.item;
        var paused = "";
        if(!nowPlaying?.is_playing){
            paused = "Currently Paused";
        }
    
        if (error) {
            return <p>{error}</p>;
        }
    
        if (!track) {
            return <p>Loading...</p>;
        }

        return (
            <div className="nowPlaying">
                <h2>I'm Listening To</h2>
                <p>{paused}</p>
                <SongCard track={track} />
                <RecentlyPlayed />
            </div>
        );
    };
    return buildData();
};

export default NowPlaying;