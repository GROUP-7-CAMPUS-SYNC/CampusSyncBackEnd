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

export const createOrganization = async (request, response) => {
    try {
        // 1. Destructure fields from request body
        const {
            organizationName,
            description,
            course,
            organizationHeadID,
            profileLink // Optional field from request
        } = request.body;
        
        // createdBy is derived from the authenticated user (middleware)
        const createdBy = request.userRegistrationDetails;

        // 2. Validate Required Fields
        if (!organizationName || !course || !organizationHeadID || !description) {
            return response.status(400).json({ message: "Missing required fields: name, course, head, or description." });
        }

        // 3. Check for Duplicate Organization Name
        const existingOrg = await Organization.findOne({ organizationName });
        if (existingOrg) {
            return response.status(409).json({ message: "Organization name already exists." });
        }

        // 4. Validate Organization Head (User) & Enforce Role Restrictions
        const headUser = await User.findById(organizationHeadID);
        if (!headUser) {
            return response.status(404).json({ message: "Selected Organization Head not found." });
        }

        // --- NEW LOGIC: Prevent Moderators from being Heads ---
        if (headUser.role === 'moderator') {
            return response.status(403).json({ 
                message: "Conflict of Interest: A Moderator cannot be assigned as an Organization Head." 
            });
        }

        // 5. Determine Profile Link (Use provided or generate default)
        // Uses organizationName as seed to ensure the same name always gets the same avatar
        const finalProfileLink = profileLink || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(organizationName)}`;

        // 6. Create the Organization
        const newOrganization = new Organization({
            organizationName,
            description,
            course,
            organizationHeadID,
            moderators: createdBy._id, // The moderator creating this is the approver
            profileLink: finalProfileLink, 
            members: 0       // Default 0 as per schema
        });

        await newOrganization.save();

        return response.status(201).json({ 
            message: "Organization created successfully.", 
            data: newOrganization 
        });

    } catch (error) {
        console.error("Error creating organization (Moderator Controllers) [createOrganization]: ", error);
        return response
            .status(500)
            .json({ message: "Internal Server Error (Moderator Controllers) [createOrganization]", error: error.message });
    }
}

export const getAllUser = async (request, response) => {
    try
    {
        const potentialHeadOrganizationUser = await User.find({ role: { $ne: "moderator" } })
            .select("firstname lastname email course profileLink role")

        return response
            .status(200)
            .json({
                message: "User fetching successfully",
                data: potentialHeadOrganizationUser
            })

    }
    catch(error)
    {
        console.error("Error fetching users (Moderator Controllers) [getAllUser]: ", error);
        return response 
            .status(500)
            .json({message: "Internal Server Error (Moderator Controllers) [getAllUser]"});
    }
}

export const updateOrganizationName = async (request, response) => {
    try {
        const { organizationId, organizationName } = request.body;

        if (!organizationId || !organizationName) {
            return response.status(400).json({ message: "Organization ID and new Name are required." });
        }

        // 1. Duplicate Check (Mandatory Logic)
        // We must check if the name exists on any document EXCEPT the one we are updating
        const duplicate = await Organization.findOne({ 
            organizationName: organizationName,
            _id: { $ne: organizationId } 
        });

        if (duplicate) {
            return response.status(409).json({ message: `Organization name '${organizationName}' already exists.` });
        }

        // 2. Atomic Update using findByIdAndUpdate
        const updatedOrg = await Organization.findByIdAndUpdate(
            organizationId,
            { $set: { organizationName: organizationName } }, // Explicitly set the new name
            { new: true, runValidators: true } // Return the modified document
        )
        .populate("organizationHeadID", "firstname lastname course email")
        .populate("moderators", "firstname lastname email");

        if (!updatedOrg) {
            return response.status(404).json({ message: "Organization not found." });
        }

        return response.status(200).json({
            message: "Organization name updated successfully.",
            data: updatedOrg
        });

    } catch (error) {
        console.error("Error updating organization (Moderator Controllers) [updateOrganizationName]: ", error);
        return response.status(500).json({ 
            message: "Internal Server Error updating organization.", 
            error: error.message 
        });
    }
};