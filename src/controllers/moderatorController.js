import Organization from "../models/Organization.js";
import User from "../models/User.js";

export const getAllOrganization = async (request, response) => {
    const {_id, role} = request.userRegistrationDetails;
    
    try
    {
        const user = await User.findById(_id);

        if(!user){
            return response.status(404).json({ message: "User not found" });
        }

        if(role !== "moderator"){
            return response.status(403).json({ message: "Access denied" });
        }

        const organizations = await Organization.find()
            .populate("organizationHeadID", "firstname lastname course email")
            .populate("moderators", "firstname lastname email");


        return response
            .status(200)
            .json(organizations)

    }catch(error)
    {
        console.error("Error fetching organizations (Moderator Controllers) [getAllOrganization]: ", error);
        return response
            .status(500)
            .json({ message: "Internal Server Error (Moderator Controllers) [getAllOrganization]" });
    }
}