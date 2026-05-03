import express from 'express';
import cors from 'cors';
import projectRouter from "./routers/projects.router.js";
import sceneRouter from "./routers/scenes.router.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/projects", projectRouter);
app.use("/scenes", sceneRouter);
app.get('/', (req, res) => {
    res.send("Hello from Writing Sessions Server!");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
