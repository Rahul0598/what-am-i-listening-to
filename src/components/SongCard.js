const SongCard = track => {
    console.log();
    if(track.track.uri.includes("track")){
        return (
            <div>
                <iframe
                    title="Spotify"
                    className="SpotifyPlayer"
                    src={`https://embed.spotify.com/?uri=${track.track.uri}&view=coverart`}
                    width={300}
                    height={380}
                    frameBorder="0"
                    allowtransparency="true"
                />
            </div>
        )
    }
    else {
        return (
            <div>
                <p>{track.track.show.publisher}</p>
                <iframe
                    title="Spotify"
                    className="SpotifyPlayer"
                    src={`https://open.spotify.com/embed-podcast/episode/${track.track.id}`}
                    width={300}
                    height={380}
                    frameBorder="0"
                    allowtransparency="true"
                />
            </div>
        )
    }
}

export default SongCard;