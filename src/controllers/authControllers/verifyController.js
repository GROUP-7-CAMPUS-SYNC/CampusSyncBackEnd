import User from "../../models/User.js";

export const verifyUser = async (request, response) => {
    try
    {
       const userId = request.userId;
       console.log("user id in the verify controller", userId)
       const user = await User.findById(userId)
        .select('-password');
        
        if (!user){
            return response.status(404).json({ message: "User not found for auto login"});
        }

        return response
            .status(200)
            .json({
                    user: {
                        _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        course: user.course,
                        email: user.email,
                        profileLink: user.profileLink,
                        role: user.role
                    },
                    message: "Token valid, auto login successful"
                });    
    }
    catch(error)
    {
        console.log("Error in VerifyUser controller", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}