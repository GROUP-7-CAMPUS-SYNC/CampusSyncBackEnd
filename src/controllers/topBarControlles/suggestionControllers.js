import SuggestionGroup from "../../models/SuggestionGroup.js";

// DATA TO SEED
const GROUP_DATA = [
    // BS Civil Engineering
    { groupName: "Structural Innovators", course: "BS Civil Engineering", members: 120 },
    { groupName: "Geotech Explorers", course: "BS Civil Engineering", members: 85 },
    { groupName: "Concrete Society", course: "BS Civil Engineering", members: 200 },
    { groupName: "Bridge Builders Guild", course: "BS Civil Engineering", members: 150 },

    // BS Information Technology
    { groupName: "NetAdmin Squad", course: "BS Information Technology", members: 340 },
    { groupName: "Web Dev Alliance", course: "BS Information Technology", members: 500 },
    { groupName: "CyberSec Ops", course: "BS Information Technology", members: 210 },
    { groupName: "SysArch Guild", course: "BS Information Technology", members: 110 },

    // BS Computer Science
    { groupName: "Algorithm Aces", course: "BS Computer Science", members: 300 },
    { groupName: "AI Innovators", course: "BS Computer Science", members: 450 },
    { groupName: "Data Science Hub", course: "BS Computer Science", members: 230 },
    { groupName: "Compiler Club", course: "BS Computer Science", members: 90 },

    // BS Food Technology
    { groupName: "Food Safety Net", course: "BS Food Technology", members: 150 },
    { groupName: "Product Dev Lab", course: "BS Food Technology", members: 180 },
    { groupName: "Sensory Eval Team", course: "BS Food Technology", members: 120 },
    { groupName: "Nutrition Techies", course: "BS Food Technology", members: 200 },
];

// 1. SEED Controller (Run this once via Postman/Browser)
export const seedSuggestionGroups = async (req, res) => {
    try {
        // Clear existing groups to avoid duplicates
        await SuggestionGroup.deleteMany({});
        
        // Insert new data
        await SuggestionGroup.insertMany(GROUP_DATA);

        return res.status(201).json({ message: "Suggestion Groups seeded successfully!" });
    } catch (error) {
        console.error("Error seeding groups:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. GET Suggestions (Filtered by User's Course)
export const getSuggestions = async (request, response) => {
    try {
        // req.user is populated by your authMiddleware
        const userCourse = request.userRegistrationDetails.course; 
        const userId = request.userRegistrationDetails._id;

        if (!userCourse) {
            return response.status(400).json({ message: "User has no course assigned." });
        }

        // Find groups matching the user's course
        const groups = await SuggestionGroup.find({ course: userCourse });

        // Map data to match Frontend Interface
        // We check if the current user's ID is in the 'followers' array
        const formattedGroups = groups.map(group => ({
            id: group._id,
            groupName: group.groupName,
            members: group.members,
            isFollowed: group.followers.includes(userId) // Returns true/false
        }));

        return response.status(200).json(formattedGroups);

    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};