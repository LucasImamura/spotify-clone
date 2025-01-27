import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAdmin = (req, res) => {
    res.send("Hello from Admin route");
}

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error("Could not upload to cloudinary");
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: True });
};

export const createSong = async (req, res, next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Audio and Image files are required"});
        }

        const {title, artist, albumId, duration} = req.body
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

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
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }
        res.status(201).json(song)
    } catch (error) {
        console.log("Error in createSong", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(songId);

        // If song belongs to an album, update the album's songs array
        if(song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            });
        }

        // Question: What if the app crashes between deleting the song from the album and deleting the song itself?
        // Should I use transactions here or am I worrying too much?
        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log("Error in deleteSong", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        const {title, artist, releaseYear} = req.body;
        const {imageFile} = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        })

        await album.save()

        res.status(201).json(album)
    } catch (error) {
        console.log("Error in createAlbum", error);
        next(error);
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({ albumId: id });
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
}
