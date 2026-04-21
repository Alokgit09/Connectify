const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Mongo DB Atlas Connected')
    }catch(err){
     console.log('DB Connection error', err.message);
     process.exit(1);
    }
};

module.exports = connectDB;