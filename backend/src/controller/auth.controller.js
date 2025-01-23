import { User } from '../model/user.model.js';

// por que está funcionando com o typo de model ao invés de models?

export const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl }= req.body;

        // check if user already exists
        const user = await User.findOne({clerkId: id});

        if(!user){
            // signup
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl,
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in auth callback", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
}