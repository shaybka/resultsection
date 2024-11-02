import { promises as fs } from "fs";
import path from "path";

const datafile_path = path.join(process.cwd(), '/helper/data.json');

export const readData = async () => {
    try {
        const jsonData = await fs.readFile(datafile_path, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading data:", error);
        throw new Error("Failed to read data");
    }
}

export const saveData = async (data) => {
    try {
        const jsonData = JSON.stringify(data); 
        await fs.writeFile(datafile_path, jsonData, 'utf8');
    } catch (error) {
        console.error("Error writing data:", error);
        throw new Error("Failed to write data");
    }
}