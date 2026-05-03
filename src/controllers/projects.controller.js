import connection from '../../db.config.js'
export const getAllProjects = async (req, res) => {
    const sql = "SELECT * FROM projects";
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

export const getProject = async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM projects WHERE id = ?";
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

export const createProject = async (req, res) => {
    const {code, title, series_title, goal} = req.body;
    console.log(req.body);
    if (!code || !title){
        return res.status(400).json({
            error: "Code and Title are required."
        });
    }
    if (isNaN(Number(goal)) || Number(goal) < 0) {
        return res.status(400).json({
            error: "Goal must be a non-negative integer."
        });
    }
    try {
        const sql = "INSERT INTO projects (code, title, series_title, goal) VALUES (?, ?, ?, ?)";
        const [result] = await connection.execute(sql, [code, title, series_title, goal]);
        if (result.affectedRows === 1) {
            return res.status(201).json({
                message: "Project created successfully.",
                id: result.insertId
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Database error",
            message: error
        });
    }
}

export const updateProject = async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const data = req.body;
    const whitelist = ["code", "title", "series_title", "goal"];
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
    console.log(cols, vals);
    const projectCheck = "SELECT id FROM projects WHERE id = ?";
    const [rows] = await connection.execute(projectCheck, [id]);
    if (rows.length === 0) {
        return res.status(400).json({
            error: "Invalid Project",
            message: "The provided project does not exist."
        });
    }
    const sql = `UPDATE projects SET ${cols.join(", ")} WHERE id = ?`;
    console.log(sql);
    const [result] = await connection.execute(sql, vals);
    if (result.affectedRows === 1){
        return res.status(201).json({
            message: "Project updated successfully.",
            id: id
        });
    } else {
        return res.status(500).json({
            error: "Database Error",
            message: "Project update failed."
        });
    }
}

export const deleteProject = async (req, res) => {
    const id = req.params.id;
    const projectCheck = "SELECT id FROM projects WHERE id = ?";
    const [rows] = await connection.execute(projectCheck, [id]);
    if (rows.length === 0) {
        return res.status(400).json({
            error: "No Data",
            message: "No records match the search criteria"
        });
    }
    const sql = "DELETE FROM projects WHERE id = ?";
    const [result] = await connection.execute(sql, [id]);
    if (result.affectedRows === 1){
        return res.status(201).json({
            message: "Project deleted successfully.",
        });
    } else {
        return res.status(500).json({
            error: "Database Error",
            message: "Project deletion failed."
        });
    }
}