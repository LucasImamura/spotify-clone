
import { Song } from '../models/song.model.js';
import { User } from '../models/user.model.js';
import { Album } from '../models/album.model.js';

export const getStats = async (req, res, next) => {
    try {
        // Slower approach, because they are executed sequentially
        // const totalSongs = await Song.countDocuments();
        // const totalUsers = await User.countDocuments();
        // const totalAlbums = await Album.countDocuments();

        // Faster approach, because they are executed in parallel
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),

            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    }
                },
                {
                    $group: {
                        _id:"$artist",
                    }
                },
                {
                    $count:"count"
                },
            ]),
        ]);

        res.status(200).json({
            totalSongs,
            totalAlbums,
            totalUsers,
            totalArtists: uniqueArtists[0]?.count || 0
        })

    } catch (error) {
        next(error);
    }
}