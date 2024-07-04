import { Router } from "express";
import { EntityTarget } from "typeorm";
import { Base } from "../entities/base";
import { BaseController } from "../controllers/baseController";
import myMiddleware from "../middlewares/myMiddleWare";

export const BaseRoutes = <T extends Base>(entity: EntityTarget<T>): Router => {
    const baseRouter = Router();
    const controller = new BaseController<T>(entity);

    baseRouter.use(myMiddleware);

    // Ruta para obtener todas las entidades
    baseRouter.get("/", (req, res) => controller.getAll(req, res));

    // Ruta para obtener todas las entidades, incluidas las eliminadas lógicamente
    baseRouter.get("/getAllDeleted", (req, res) => controller.getAllDeleted(req, res));

    // Ruta para obtener una entidad por su ID
    baseRouter.get("/:id", (req, res) => controller.getById(req, res));

    // Ruta para crear una nueva entidad
    baseRouter.post("/", (req, res) => controller.create(req, res));

    // Ruta para actualizar una entidad por su ID
    baseRouter.patch("/:id", (req, res) => controller.update(req, res));

    // Ruta para eliminar una entidad por su ID
    baseRouter.delete("/:id", (req, res) => controller.delete(req, res));

    // Ruta para eliminar lógicamente una entidad por su ID
    baseRouter.delete("/logicDelete/:id", (req, res) => controller.logicDelete(req, res));

    // Ruta para restaurar lógicamente una entidad eliminada
    baseRouter.patch("/restoreLogicDeleted/:id", (req, res) => controller.restoreLogicDeleted(req, res));

    return baseRouter;
};
