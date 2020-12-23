export const getPlayback = async (updateNowPlaying, api) => {
    try {
        const data = await 
            fetch(api).then(res => {
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