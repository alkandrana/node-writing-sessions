import {Router} from "express";
import { getAllScenes, getScenesByProject, getScene, getMetadata, createScene, updateScene, deleteScene } from '../controllers/scenes.controller.js';

const sceneRouter = Router();

sceneRouter.get('/', getAllScenes);
sceneRouter.post('/', createScene);
sceneRouter.get('/metadata', getMetadata);
sceneRouter.get('/project/:project_id', getScenesByProject);
sceneRouter.get('/:id', getScene);
sceneRouter.patch('/:id', updateScene);
sceneRouter.delete('/:id', deleteScene);

export default sceneRouter;
