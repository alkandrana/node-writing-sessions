import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { projects, scenes } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { beats } from '../utils/metadata.js';

const db = drizzle(process.env.DATABASE_URL);

export const getAllProjects = async (req, res) => {
  const projectResult = await db.select().from(projects);
  return res.json(projectResult);
}

export const getProjectByCode = async (req, res) => {
    const code = req.params.code;
    const [project] = await db.select().from(projects)
        .where(eq(projects.code, code));
    if (!project) {
        return res.sendStatus(404);
    } else {
        return res.json(project);
    }
}

export const getProjectProgress = async (req, res) => {
    const projectId = req.params.id;
    const sceneList = await db.select().from(scenes)
        .where(eq(scenes.projectId, projectId));
    const projectTarget = await db.select({ target: projects.goal }).from(projects);
    console.log("Word Count Goal: ", projectTarget);
    let wordCount = 0;
    console.log("Scenes: ", sceneList.length);
    for (let sc of sceneList) {
        wordCount += sc.words;
        sc.tsf = wordCount;
        sc.pot = ((wordCount / projectTarget) * 100).toFixed(2);
        for (let b in beats){
            if (beats[b].start < sc.pot && beats[b].end > sc.pot){
                sc.beat = b;
            }
        }
    }
    return res.json(sceneList);
}

export const getProject = async (req, res) => {
    const id = req.params.id;
    const [project] = await db.select().from(projects)
      .where(eq(projects.id, id));
    if (!project) {
        return res.sendStatus(404);
    } else {
        return res.json(project);
    }
}

export const getProjectMetadata = async (req, res) => {
    const metadata = {
        name: "projects",
        label: "Projects",
        size: 0,
        columns: []
    }
    const columns = Object.keys(projects);
    console.log(columns);
    metadata.size = columns.length;
    for (const col of columns) {
        let current = projects[col];
        let datatype = current.enumValues ? "enum" :
            current.dataType;
        metadata.columns.push({
            name: col,
            datatype: datatype,
            nullable: !current.notNull,
            values: current.enumValues
        });
    }
    return res.json(metadata);
}

export const createProject = async (req, res) => {
    const project = req.body;
    console.log("Pre-post data: ", req.body);
    const response = db.insert(projects).values(project);
    console.log("Creation status: ", response);
    return res.json({
        message: "Project created successfully.",
        id: response[0].insertId
    });
}

export const updateProject = async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const data = req.body;
    console.log(data);
    const response = await db.update(projects).set(data)
      .where(eq(projects.id, id));
    return res.json({
        status: response[0].info,
        message: "Project updated successfully.",
        id: id
    });
}

export const deleteProject = async (req, res) => {
    const id = req.params.id;
    const response = await db.delete(projects)
      .where(eq(projects.id, id));
    return res.status(201).json({
        id: id,
        status: `Rows affected: ${response[0].affectedRows}`,
        message: "Project deleted successfully.",
    });
}
