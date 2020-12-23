import React, {useState, useEffect} from 'react';
import RecentlyPlayed from './RecentlyPlayed';
import SongCard from './SongCard';

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
                <SongCard track={track} />
            </div>
        );
    };
    return buildData();
};

export default NowPlaying;