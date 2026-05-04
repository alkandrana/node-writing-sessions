import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { sessions} from "../db/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

export const getAllSessions = async (req, res) => {
    const sessionResult = await db.select()
        .from(sessions);
    console.log(sessionResult);
    return res.json(sessionResult);
}

export const getSessionMetadata = (req, res) => {
    const metadata = {
        name: "Sessions",
        label: "Writing Sessions",
        size: 0,
        columns: []
    }
    const columns = Object.keys(sessions);
    metadata.size = columns.length;
    for (const col of columns) {
        const current = sessions[col];
        metadata.columns.push({
            name: col,
            datatype: current.enumValues ? "enum" : current.dataType,
            nullable: !current.notNull,
            values: current.enumValues
        });
    }
    return res.json(metadata);
}

export const getSessionsByScene = async (req, res) => {
    const sceneId = req.params.sceneId;
    const sessionList = await db.select().from(sessions)
        .where(eq(sessions.sceneId, sceneId));
    return res.json(sessionList);
}
export const getSession = async (req, res) => {
    const id = req.params.id;
    const session = await db.select()
        .from(sessions).where(eq(sessions.id, id));
    console.log(session);
    return res.json(session);
}

export const createSession = async (req, res) => {
    const session = req.body;
    const response = await db.insert(sessions).values(session);
    console.log(response);
    return res.json({
        id: response[0].insertId,
        status: `Rows affected: ${response[0].affectedRows}`,
        message: "Session created successfully"
    });
}

export const updateSession = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const response = await db.update(sessions).set(data);
    return res.json({
        id: id,
        status: response[0].info,
        message: "Session updated successfully"
    });
}

export const deleteSession = async (req, res) => {
    const id = req.params.id;
    const response = await db.delete(sessions).where(eq(sessions.id, id));
    return res.json({
        id: id,
        status: `Rows affected: ${response[0].affectedRows}`,
        message: "Session deleted successfully"
    });
}