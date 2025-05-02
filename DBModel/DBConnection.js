import mongoose from "mongoose";


export default async () => {
console.log(process.env.MONGODB);

    return mongoose.connect(process.env.MONGODB);
}