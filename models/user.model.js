import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "User name is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        //regex to check for its email
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 6,
    }
}, { timestamps: true });

//models usually starts with cap letters
const User = mongoose.model('User', userSchema);

export default User;



//example of putting data inside this
// User.create({ name:, email:, password: })!
