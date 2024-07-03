import dotenv from 'dotenv';
import path from 'path';
import { DatabaseType } from 'typeorm';

dotenv.config(); // Carga las variables de entorno

const entitiesPath = path.join(__dirname, "entities", "*.ts");

export const dbConfig = {
    type: process.env.DB_TYPE as DatabaseType || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'admin',
    entities: [entitiesPath],
    synchronize: true,
    logging: false,
};
