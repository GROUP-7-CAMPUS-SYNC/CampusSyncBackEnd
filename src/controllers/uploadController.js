import cloudinary from "../lib/cloudinary.js";

export const generateSignature = (request, response) => {

    try
    {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "CampusPostImage";

        // Generate Signature 

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: folder
            },
            process.env.CLOUDINARY_API_SECRET
        )

        // Send the signature + plublic key to the front end 
        response
            .status(200)
            .json
            ({
                timestamp,
                signature,
                folder,
                apiKey: process.env.CLOUDINARY_API_KEY,
                cloudName: process.env.CLOUDINARY_CLOUD_NAME
            })
    }
    catch(error)
    {
        console.error("Signature generation Error (Upload Controllers)")
        response
            .status(500)
            .json({
                message: "Internal Server error (Upload Controllers)",
                error: error.message
            })
    }
}