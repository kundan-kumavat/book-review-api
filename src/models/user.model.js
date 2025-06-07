const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: { // password should contains minimum 6 characrers
            type: String,
            required: [true, "Password is required"],
            min: [6, "Must be Atleast of 6 characters"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        refreshToken: {
            type: String
        }
    }, {timestamps: true}
);


// Generate Access Token using JWT
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Generate Refresh Token using JWT
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

module.exports = mongoose.model('User', userSchema);