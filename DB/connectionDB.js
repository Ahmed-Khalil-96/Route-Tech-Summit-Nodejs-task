import mongoose from "mongoose";

const connection = async () => {
    return await mongoose.connect(`${process.env.url}`).then(() => {
        console.log("db is connected successfully");
    }).catch((err) => {
        console.log(err);
    });
};

export default connection;
