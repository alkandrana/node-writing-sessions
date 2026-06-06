import {Router} from "express";
import { getAllProjects, getProjectByCode, getProject, getProjectProgress, getProjectMetadata, createProject, updateProject, deleteProject } from '../controllers/projects.controller.js';

const projectRouter = Router();

projectRouter.get('/', getAllProjects);
projectRouter.post('/', createProject);
projectRouter.get('/metadata', getProjectMetadata);
projectRouter.get('/code/:code', getProjectByCode);
projectRouter.get('/:id', getProject);
projectRouter.get('/:id/progress', getProjectProgress);
projectRouter.patch('/:id', updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;