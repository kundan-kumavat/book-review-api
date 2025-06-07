const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});

        return {accessToken, refreshToken};
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while generating the token"
        });
    }
}

const registerUser = async(req, res) => {
    const {email,username, password} = req.body;

    if(
        [email, username, password].some((field) => field?.trim() === "")
    ){
        return res.status(400).json({
            message: "Email or password is required",
        })
    }

    try {
        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        });

        if(existingUser){
            return res.status(409).json({
                message: 'User already exits',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: email,
            username: username,
            password: hashedPassword
        });

        const createdUser = await User.findById(user?._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            return res.status(500).json({
                message: "Something went wrong while creating the user",
            })
        }

        return res.status(201).json({
            message: "User registered successfully",
            user: createdUser,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Something went wrong while creating the user'
        })
    }
};

const loginUser = async(req, res) => {
    const {email, username, password} = req.body;

    if(!username && !email){
        return res.status(400).json({
            message: "username or email is required",
        })
    }

    try {
        const user = await User.findOne({
            $or: [{username}, {email}]
        });

        if(!user){
            return res.status(404).json({
                message: "user doesnot exits"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        };

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id);

        const loggedInUser = await User.findById(user?._id).select("-password -refreshToken");

        return res.status(200).json({
            message: "user logged in successfully",
            user: loggedInUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Something went wrong while logging the user'
        })
    }
}

const refreshAccessToken = async(req, res) => {
    const incomingRefreshToken = req.body.refreshToken;

    if(!incomingRefreshToken){
        return res.status(401).json({
            message: "Unathorized Access"
        })
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if(!user){
            return res.status(401).json({
                message: "Invalid refresh token",
            })
        }

        if(incomingRefreshToken !== user?.refreshToken){
            return res.status(401).json({
                message: "Refresh token is expired"
            })
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        return res.status(200).json({
            accessToken: accessToken,
            refreshToken : refreshToken
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Something went wrong while refreshing the access token'
        })
    }
}

module.exports = {registerUser, loginUser, refreshAccessToken};