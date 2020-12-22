const SongCard = track_uri => {
    return (
        <iframe
            title="Spotify"
            className="SpotifyPlayer"
            src={`https://embed.spotify.com/?uri=${track_uri}&view=coverart&theme=black`}
            width={300}
            height={380}
            frameBorder="0"
            allowtransparency="true"
        />
    )
}

export default SongCard;