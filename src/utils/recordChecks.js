import connection from "../../db.config.js";
// import metadata from "metadata.js";

export async function checkProjectExists(res, project_id) {
    const projectCheck = "SELECT id FROM projects WHERE id = ?";
    const [rows] = connection.execute(projectCheck, [project_id]);
    if (rows.length === 0) {
        return res.status(400).json({
            error: "No Record Found",
            message: "Invalid project ID"
        });
    }
}

export async function checkSceneExists(res, scene_id) {
    const sceneCheck = "SELECT id FROM scenes WHERE id = ?";
    const [rows] = connection.execute(sceneCheck, [scene_id]);
    if (rows.length === 0) {
        return res.status(400).json({
            error: "No Record Found",
            message: "Invalid scene ID"
        });
    }
}

export function buildMetadata(field){
    const metadata = {};
    metadata.name = field.Field;
    if (field["Type"].includes("enum")){
        let typeParts = field["Type"].split(/[()]/);
        let valueList = typeParts[1].split(",").map(v => v.replaceAll("'", ""));
        metadata.datatype = typeParts[0];
        metadata.valueList = valueList;
    } else if(field["Type"].includes("varchar")){
        metadata.datatype = "string";
    } else if(field["Type"].includes("int")){
        metadata.datatype = "int";
    } else {
        metadata.datatype = field["Type"];
    }
    if (field.Key === "PRI"){
        metadata.isPrimaryKey = true;
    } else if (field.Key === "MUL"){
        metadata.isForeignKey = true;
    } else if (field.Key === "UNI"){
        metadata.isUnique = true;
    }
    metadata.nullable = field.Null === "YES";
    metadata.hasAutoIncrement = field.Extra === "auto_increment";
    metadata.default = {
        hasDefault: field.Default !== null,
        defaultValue: field.Default
    };
    return metadata;
}