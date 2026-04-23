import express from 'express';
import cors from 'cors';
import projectRouter from "./routers/projects.router.js";
import connection from '../db.config.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use("/projects", projectRouter);
app.get('/', (req, res) => {
    res.send("Hello from Writing Sessions Server!");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
