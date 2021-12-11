import React, {useState, useEffect} from 'react';
import RecentlyPlayed from './RecentlyPlayed';

const getNowPlaying = async (updateNowPlaying) => {
    try {
        const data = await 
            fetch('/api/nowPlaying').then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('error');
            })
            .catch(() =>
                updateNowPlaying({ error: 'Whoops! Something went wrong with Spotify API' })
            );
        updateNowPlaying(data);
    }catch(err){
        console.log("Error : ", err);
    }
};

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  

const NowPlaying = () => {
    const [nowPlaying, updateNowPlaying] = useState(0);  

    useEffect(() => {
        getNowPlaying(updateNowPlaying);
        const interval = setInterval(() => { getNowPlaying(updateNowPlaying) }, 60000);
        return () => clearInterval(interval);
    }, []);

    const buildData = () => {
        const  { error } = nowPlaying;
        if(!nowPlaying?.listening){
            return <RecentlyPlayed />;
        }

        const track = nowPlaying?.item;
        var paused = "";
        if(!nowPlaying?.is_playing){
            paused = "Currently Paused";
        }
        var timeRemaining = Number(nowPlaying?.item?.duration_ms) - Number(nowPlaying?.progress_ms);
    
        if (error) {
            return <p>{error}</p>;
        }
    
        if (!track) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <h2>I'm Listening To</h2>
                <p>{paused}</p>
                <iframe
                    title="Spotify"
                    className="SpotifyPlayer"
                    src={`https://embed.spotify.com/?uri=${track.uri}&view=coverart&theme=black`}
                    width={300}
                    height={380}
                    frameBorder="0"
                    allowtransparency="true"
                />
                <p>Time Remaining {millisToMinutesAndSeconds(timeRemaining)}</p>
            </div>
        );
    };
    return buildData();
};

export default NowPlaying;
