import "reflect-metadata";
import { DataSource } from "typeorm";
import dbConfig from "./dbConfig";

export const AppDataSource = new DataSource(dbConfig);
