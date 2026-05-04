import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { projects } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

export const getAllProjects = async (req, res) => {
  const projectResult = await db.select().from(projects);
  console.log("All projects: ", projectResult);
  return res.json(projectResult);
}

export const getProject = async (req, res) => {
    const id = req.params.id;
    const project = await db.select().from(projects)
      .where(eq(projects.id, id));
    console.log("Project: ", project);
    return res.json(project);
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
