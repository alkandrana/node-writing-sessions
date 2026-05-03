import connection from '../../db.config.js'
import { checkProjectExists, checkSceneExists, buildMetadata } from "../utils/recordChecks.js";
// import metadata from "../utils/metadata.js";

export const getAllScenes = async (req, res) => {
    const sql = "SELECT * FROM scenes";
    const [rows] = await connection.execute(sql);
    if (rows.length === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "No records match the search criteria"
        });
    } else {
        return res.json(rows);
    }
}

export const getScenesByProject = async (req, res) => {
    const project_id = req.params.project_id;
    try {
        const sql = "SELECT * FROM scenes WHERE project_id = ?";
        const [rows] = await connection.execute(sql, [project_id]);
        if (rows.length === 0) {
            return res.status(404).json({
                error: "Not Found",
                message: "No records match the search criteria"
            });
        } else {
            return res.json(rows);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Database error",
            message: "There was an error fetching the data."
        });
    }
}

export const getScene = async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM scenes WHERE id = ?";
    const [rows] = await connection.execute(sql, [id]);
    if (rows.length === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "No records match the search criteria"
        });
    } else if (rows.length === 1) {
        return res.json(rows[0]);
    }
}

export const getSceneMetadata = async (req, res) => {
    try {
        const sql = "DESC scenes";
        const [rows] = await connection.execute(sql);
        if (rows.length === 0) {
            return res.status(404).json({
                error: "Not Found",
                message: "No records match the search criteria"
            });
        } else {
            const metadataList = [];
            for (let row of rows) {
                let metadata = buildMetadata(row);
                metadataList.push(metadata);
            }
            return res.json(metadataList);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Database error",
            message: "There was an error fetching the data."
        });
    }
}

export const createScene = async (req, res) => {
    const {code, sceneName, sequence, words, status, project_id} = req.body;
    console.log(req.body);
    if (!code || !project_id) {
        return res.status(400).json({
            error: "Code and Project ID are required."
        });
    }
    if (isNaN(Number(words)) || Number(words) < 0) {
        return res.status(400).json({
            error: "Goal must be a non-negative integer."
        });
    }
    try {
        await checkProjectExists(res, project_id);
        const sql = "INSERT INTO scenes (code, name, sequence, words, status, project_id) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await connection.execute(sql, [code, sceneName, sequence, words, status, project_id]);
        if (result.affectedRows === 1) {
            return res.status(201).json({
                message: "Scene created successfully.",
                id: result.insertId
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Database error",
            message: error
        });
    }
}

export const updateScene = async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const data = req.body;
    const whitelist = ["code", "name", "sequence", "status", "words", "project_id"];
    const [cols, vals] = [[], []];
    for (const key in data){
        if (whitelist.includes(key)){
            cols.push(`${key} = ?`);
            vals.push(data[key]);
        }
    }
    vals.push(id);
    if (cols.length === 0){
        return res.status(400).json({
            error: "No Data",
            message: "No valid data submitted."
        });
    }
    try {
        if (data.project_id) {
            await checkProjectExists(res, data.project_id);
        }
        await checkSceneExists(res, id);
        const sql = `UPDATE scenes SET ${cols.join(", ")} WHERE id = ?`;
        const [result] = await connection.execute(sql, vals);
        if (result.affectedRows === 1) {
            return res.status(201).json({
                message: "Scene updated successfully.",
                id: id
            });
        } else {
            return res.status(500).json({
                error: "Database Error",
                message: "Scene update failed."
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Database error",
            message: error
        })
    }
}

export const deleteScene = async (req, res) => {
    const id = req.params.id;
    await checkSceneExists(res, id);
    const sql = "DELETE FROM scenes WHERE id = ?";
    const [result] = await connection.execute(sql, [id]);
    if (result.affectedRows === 1){
        return res.status(201).json({
            message: "Scene deleted successfully.",
        });
    } else {
        return res.status(500).json({
            error: "Database Error",
            message: "Scene deletion failed."
        });
    }
}

