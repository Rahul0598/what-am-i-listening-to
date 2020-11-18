import React, {useState, useEffect} from 'react';

const getRecentlyPlayed = async (updateRecentlyPlayed) => {
    try {
        const data = await 
            fetch('/api/recentlyPlayed').then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('error');
            })
            .catch(() =>
                updateRecentlyPlayed({ error: 'Whoops! Something went wrong with Spotify API' })
            );
        updateRecentlyPlayed(data);
    }catch(err){
        console.log(err);
    }
};


const RecentlyPlayed = () => {
    const [recentlyPlayed, updateRecentlyPlayed] = useState(0);  

    useEffect(() => {
        getRecentlyPlayed(updateRecentlyPlayed);
        const interval = setInterval(() => { getRecentlyPlayed(updateRecentlyPlayed) }, 60000);
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
                <h2>Looks like I'm not listening to anything right now</h2>
                <h2>Recently Played Tracks</h2>
                {
                    tracks.map(trac => {
                            const {played_at, track} = trac;
                            var localDate = (new Date(played_at)).toLocaleString();
                            return (
                                <div key={track.id} className='track'>
                                    <iframe
                                        title="Spotify"
                                        className="SpotifyPlayer"
                                        src={`https://embed.spotify.com/?uri=${track.uri}&view=coverart&theme=black`}
                                        width={300}
                                        height={380}
                                        frameBorder="0"
                                        allowtransparency="true"
                                    />
                                    <p>{localDate}</p>
                                </div>
                            )
                        }
                    )
                }
            </div>
        );
    };
    return buildData();
};

export default RecentlyPlayed;