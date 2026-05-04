import express from 'express';
import cors from 'cors';
import projectRouter from "./routers/projects.router.js";
import sceneRouter from "./routers/scenes.router.js";
import sessionRouter from "./routers/sessions.router.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/projects", projectRouter);
app.use("/scenes", sceneRouter);
app.use("/sessions", sessionRouter);
app.get('/', (req, res) => {
    res.send("<h2>Hello from Writing Sessions Server!</h2>");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
