// Se utiliza para los decoradores en ts
import "reflect-metadata";
// Framework para aplicaciones web
import express from "express";
// Cross origin
import cors from "cors";
// Importa la config de la db
import { AppDataSource } from "./data-source";
import { loadRoutes } from "./routes/routesLoader";

const app = express();
// Deshabilita en el encabezado de la request que estás usando express
app.disable("x-powered-by");
// Se usa para analizar las solicitudes con cargas json
app.use(express.json());
// Habilita cors
app.use(cors());
// Se crean las rutas
loadRoutes(app);

// Obtiene el puerto de la variable de entorno
// Si no está definida, usa el puerto 3000
const APP_PORT = process.env.PORT ?? 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

app.listen(APP_PORT, () => {
    console.log(`Server running on http://localhost:${APP_PORT}`);
});
