import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
        console.log("Connecting to MongoDB");
		await mongoose.connect(process.env.MONGODB_URI as string);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", (error as Error).message);
        console.error((error as Error).stack);
	}
};

export default connectToMongoDB;