const SongCard = track => {
    if(track.track.uri.includes("track")){
        return (
            <iframe
                title="Spotify"
                className="SpotifyPlayer"
                src={`https://embed.spotify.com/?uri=${track.track.uri}&view=coverart`}
                width={"100%"}
                height={380}
                frameBorder="0"
                allowtransparency="true"
            />
        )
    }
    else {
        return (
            <iframe
                title="Spotify"
                className="SpotifyPlayer"
                src={`https://open.spotify.com/embed-podcast/episode/${track.track.id}`}
                width={"100%"}
                height={380}
                frameBorder="0"
                allowtransparency="true"
            />
        )
    }
}

export default SongCard;