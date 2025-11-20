import jwt from "jsonwebtoken";
import User from "../../models/User.js"; 

const ALLOWED_COURSES = [
    "BS Civil Engineering", 
    "BS Information Technology", 
    "BS Computer Science", 
    "BS Food Technology"
];

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const register = async (request, response) => {
    try {
        const { firstname, lastname, course, email, password } = request.body;

        // 1. Validate existence of all fields
        if (!firstname || !lastname || !course || !email || !password) {
            return response.status(400).json({ message: "All fields are required" });
        }

        // 2. [NEW] Validate Email Domain
        if (!email.endsWith("@1ustp.edu.ph")) {
            return response.status(403).json({ message: "USTP email domain is required" });
        }

        // 3. Validate Course Enum
        if (!ALLOWED_COURSES.includes(course)) {
            return response.status(400).json({ 
                message: "Invalid course selected. Please choose a valid program.",
                allowedCourses: ALLOWED_COURSES 
            });
        }

        // 4. Validate password length
        if (password.length < 6) {
            return response.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 5. Security check: Password content
        if (password.includes(firstname) || password.includes(lastname)) {
            return response.status(400).json({ message: "Password cannot contain your name" });
        }

        // 6. Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: "Email already exists" });
        }

        // 7. Generate avatar and create user
        const profileLink = `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstname}${lastname}`;

        const user = new User({
            firstname,
            lastname,
            course, 
            email,
            password,
            profileLink
        });

        await user.save();

        const token = generateToken(user._id);

        return response.status(201).json({
            token,
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                course: user.course,
                email: user.email,
                profileLink: user.profileLink,
                role: user.role
            },
            message: "User registered successfully"
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return response.status(400).json({ message: messages[0] });
        }

        console.log("Error in register controller", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};