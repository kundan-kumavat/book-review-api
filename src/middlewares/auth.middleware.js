const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const verifyJWT = async(req, res, next) => {

    let token = req.headers.authorization;
    try {

        // check for the token
        if(token){

            // Extracting the token value
            token = token.split(" ")[1];

            // Decoding the token using token secret
            let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Finding the user based on id
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            if(!user){
                return res.status(401).json({message: "Invlaid token"});
            }

            // Adding user to the request
            req.user = user;
        }else{
            return res.status(400).json({
                message: "Unathorized user"
            });
        }

        // Calling next function
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Something went wrong"});
    }
}

module.exports = verifyJWT;