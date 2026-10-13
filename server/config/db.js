import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vigilo";

const connetDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB is connected successfully...");
    } catch (error) {
        console.error("MongoDB connnection Failed: ", error.message);
        process.exit(1);
    }
};

export default connetDB;