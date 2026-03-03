import mongoose from "mongoose";
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1","8.8.8.8"]);


dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log(error);
    });

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export { mongoose, s3Client };