import {Router} from "express";
import { getAllProjects, getProject, getProjectMetadata, createProject, updateProject, deleteProject } from '../controllers/projects.controller.js';

const projectRouter = Router();

projectRouter.get('/', getAllProjects);
projectRouter.post('/', createProject);
projectRouter.get('/metadata', getProjectMetadata);
projectRouter.get('/:id', getProject);
projectRouter.patch('/:id', updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;