import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (request, response, next) => {
    let token;

    if
    (
        request.headers.authorization &&
        request.headers.authorization.startsWith("Bearer")
    )
    {
        try
        {
            token = request.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            request.userId = await User.findById(decoded.userId).select("-password")

            next();
        }catch(error)
        {
            console.log(error);
            return response
                .status(401)
                .json({ message: "Not authorized, token failed" });
        }
    }

    if(!token){
        return response
            .status(401)
            .json({ message: "Not authorized, no token" });
    }
}