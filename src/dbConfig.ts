import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();
const entitiesPath = path.join(__dirname, "entities", "*.ts"); // Ajusta la ruta según la ubicación de tus entidades


const dbConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [entitiesPath],
    synchronize: true,
    logging: false,
};

export default dbConfig;
