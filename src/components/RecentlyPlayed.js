import React, {useState, useEffect} from 'react';
import {getPlayback} from '../data/getPlayback';
import SongCard from './SongCard';

const RecentlyPlayed = () => {
    const [recentlyPlayed, updateRecentlyPlayed] = useState(0);

    useEffect(() => {
        var api_url = '/api/recentlyPlayed'
        getPlayback(updateRecentlyPlayed, api_url);
        const interval = setInterval(() => { getPlayback(updateRecentlyPlayed, api_url) }, 60000);
        return () => clearInterval(interval);
    }, []);

    const buildData = () => {
        const  { error } = recentlyPlayed;
        const tracks = recentlyPlayed?.items;
    
        if (error) {
            return <p>{error}</p>;
        }
    
        if (!tracks) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <div className="splitScreen">
                    <div className="leftPane">
                        <h2>Last Played Track</h2>
                        <div className='track'>
                            {
                                tracks.map(trac => {
                                        const {played_at, track} = trac;
                                        var localDate = (new Date(played_at)).toLocaleString();
                                        return (
                                            <div key={track.id}>
                                                <SongCard track={track}/>
                                                <p>{localDate}</p>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return buildData();
};

export default RecentlyPlayed;