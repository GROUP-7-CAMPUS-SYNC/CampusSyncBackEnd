import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    course: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "BS Civil Engineering", 
            "BS Information Technology", 
            "BS Computer Science", 
            "BS Food Technology"
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,    
    },
    password: {
        type: String,
        required: true,
        minlength: 6        
    },
    profileLink: {
        type: String,
        default: ""   
    },
    role: {
        type: String,
        enum: ["user", "moderator"], 
        default: "user"
    },

    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    }],
},
{
    timestamps: true
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;