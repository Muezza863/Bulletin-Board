import express from "express";
import { mongoose } from "./configurations/index.js";
import router from "./route/route.js";
import * as middleware from "./middleware/index.js";
import swaggerUi from 'swagger-ui-express';
import specs from './configurations/swagger.js';
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded());

app.use("/uploads", express.static("uploads"));

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// })

app.use("/api", middleware.generalLimiter, router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));  

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})