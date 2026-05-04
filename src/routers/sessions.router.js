import {Router} from "express";
import {
    getAllSessions, getSessionMetadata, getSession,
    createSession, updateSession, deleteSession, getSessionsByScene
}
    from "../controllers/sessions.controller.js";

const sessionRouter = Router();

sessionRouter.get('/', getAllSessions);
sessionRouter.get('/metadata', getSessionMetadata);
sessionRouter.get('/scene/:sceneId', getSessionsByScene);
sessionRouter.get('/:id', getSession);
sessionRouter.post('/', createSession);
sessionRouter.patch('/:id', updateSession);
sessionRouter.delete('/:id', deleteSession);

export default sessionRouter;