export const getMe = async (request, response) => {
    try {
        const user = request.userRegistrationDetails;

        return response.status(200).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            profileLink: user.profileLink
        });
    } catch (error) {
        console.error("Error in getMe:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}