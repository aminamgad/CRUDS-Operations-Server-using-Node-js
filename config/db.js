const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () =>{

    try {
       const connection = await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log(`DB is connected ${connection.connection.host}`);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB