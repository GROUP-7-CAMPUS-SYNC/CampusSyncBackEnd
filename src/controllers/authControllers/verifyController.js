import User from "../../models/User.js";

export const verifyUser = async (request, response) => {
    try
    {
       const userRegistrationDetails = request.userRegistrationDetails;
       console.log("user id in the verify controller", userRegistrationDetails)
        
        if (!userRegistrationDetails){
            return response.status(404).json({ message: "User not found for auto login"});
        }

        return response
            .status(200)
            .json({
                    user: {
                        _id: userRegistrationDetails._id,
                        firstname: userRegistrationDetails.firstname,
                        lastname: userRegistrationDetails.lastname,
                        course: userRegistrationDetails.course,
                        email: userRegistrationDetails.email,
                        profileLink: userRegistrationDetails.profileLink,
                        role: userRegistrationDetails.role
                    },
                    message: "Token valid, auto login successful"
                });    
    }
    catch(error)
    {
        console.log("Error in VerifyUser controller", error);
        return response.status(500).json({ message: "Internal Server Error (VerifyUser Controller)" });
    }
}