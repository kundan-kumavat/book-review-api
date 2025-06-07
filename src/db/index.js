const mongoose = require('mongoose');

const connectDB = async() =>{
    try {

        // Connects to the mongodb atlas with the mongoDB connection String
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
        // console.log(connectionInstance);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;