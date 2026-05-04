import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { scenes } from '../db/schema.js';
import { scenesRelations } from "../../drizzle/relations.ts";
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

export const getAllScenes = async (req, res) => {
    const sceneResult = await db.select().from(scenes);
    console.log(sceneResult);
    return res.json(sceneResult);
}

export const getMetadata = async (req, res) => {
    const metadata = {
        name: "scenes",
        label: "Scenes",
        size: 0,
        columns: []
    };
    const columns = Object.keys(scenes);
    metadata.size = columns.length;
    for (const col of columns) {
        metadata.columns.push({
            name: col,
            datatype: scenes[col].enumValues ? "enum" : scenes[col].dataType,
            nullable: !scenes[col].notNull,
            values: scenes[col].enumValues
        });
    }
    //console.log(metadata);
    res.json(metadata);
}

export const getScenesByProject = async (req, res) => {
    const project_id = req.params.project_id;
    const sceneList = await db.select().from(scenes)
      .where(eq(scenes.projectId, project_id));
    return res.json(sceneList);
}

export const getScene = async (req, res) => {
    const id = req.params.id;
    const scene = await db.select().from(scenes)
      .where(eq(scenes.id, id));
    return res.json(scene);
}

export const createScene = async (req, res) => {
    const scene = req.body;
    const response = await db.insert(scenes).values(scene);
    console.log("Creation status: ", response);
    return res.json({
        message: "Scene created successfully.",
        id: response[0].insertId
    });
}

export const updateScene = async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const data = req.body;
    const response = await db.update(scenes).set(data)
      .where(eq(scenes.id, id));
    return res.status(201).json({
        message: "Scene updated successfully.",
        status: response[0].info,
        id: id
    });
}

export const deleteScene = async (req, res) => {
    const id = req.params.id;
    const response =
        await db.delete(scenes).where(eq(scenes.id, id));
    return res.json({
        id: id,
        message: "Scene deleted successfully.",
        status: `Affected rows: ${response[0].affectedRows}`
    });
}

