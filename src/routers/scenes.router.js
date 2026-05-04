import {Router} from "express";
import { getAllScenes, getScenesByProject, getScene, /*getSceneMetadata,*/ createScene, updateScene, deleteScene } from '../controllers/scenes.controller.js';

const sceneRouter = Router();

sceneRouter.get('/', getAllScenes);
sceneRouter.post('/', createScene);
// sceneRouter.get('/metadata', getSceneMetadata);
sceneRouter.get('/project/:project_id', getScenesByProject);
sceneRouter.get('/:id', getScene);
sceneRouter.patch('/:id', updateScene);
sceneRouter.delete('/:id', deleteScene);

export default sceneRouter;
