export const getAdmin = (req, res) => {
    res.send("Hello from Admin route");
}

export const createSong = async (req, res) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Audio and Image files are required"});
        }

        const {title, artist, albumId, duration} = req.body
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        })

        await song.save()

        // if song belongs to an album, update the album's songs array
        if(albumId) {
            await albumId.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }
        res.status(201).json(song)
    } catch (error) {
        console.log("Error in createSong", error);
        res.status(500).json({ message: "Internal server error" });
    }
};