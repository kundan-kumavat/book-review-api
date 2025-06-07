const dotenv = require('dotenv');
const {app} = require('./app.js');
const connectDB = require('./db/index.js');

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
    // App Listening to port 3000
    app.listen(PORT, ()=>{
        console.log(`Server started on PORT: ${PORT}`);
    })
})
.catch((error) => {
    console.log(`MongoDB connection failed, `, error);
});

app.get('/', (req, res) => {
    res.send("Book review system developed by kundan");
});