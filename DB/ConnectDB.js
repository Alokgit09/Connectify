const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(
            'mongodb+srv://aloky0901:Alok123@cluster0.kam36.mongodb.net/connectify?retryWrites=true&w=majority'
        );
        console.log('Mongo DB Atlas Connected')
    }catch(err){
     console.log('DB Connection error', err.message);
     process.exit(1);
    }
};

module.exports = connectDB;