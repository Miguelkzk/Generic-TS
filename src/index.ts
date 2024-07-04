import "reflect-metadata";
import { AppDataSource } from "./AppDataSource";
import myMiddleware from "./middlewares/myMiddleWare";
import express from 'express';
import { loadRoutes } from "./routes/routeLoader";

const app = express();

app.use(express.json());
loadRoutes(app); // Llama a la función para cargar las rutas
app.use(myMiddleware);


async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error initializing data source: ", err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

main();