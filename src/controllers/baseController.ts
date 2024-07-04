import { BaseRepository } from "../repositories/baseRepository";
import { Request, Response } from "express";
import { EntityTarget, DeepPartial } from "typeorm";
import { Base } from "../entities/base";

export class BaseController<T extends Base> {
    private repository: BaseRepository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = new BaseRepository(entity);
    }

    async getAll(req: Request, res: Response) {
        try {
            const entities = await this.repository.findAllEntities();
            res.status(200).json(entities);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getAllDeleted(req: Request, res: Response) {
        try {
            const entities = await this.repository.find({ withDeleted: true });
            res.status(200).json(entities);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const entity = await this.repository.findByIdEntity(id);
            res.status(200).json(entity);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async create(req: Request, res: Response) {
        const data: DeepPartial<T> = req.body;

        try {
            const newEntity = await this.repository.createEntity(data);
            res.status(201).json(newEntity);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const data: DeepPartial<T> = req.body;

        try {
            const updatedEntity = await this.repository.updateEntity(id, data);
            res.status(200).json(updatedEntity);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const deletedEntity = await this.repository.deleteEntity(id);
            res.status(200).json(deletedEntity);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async logicDelete(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const deletedEntity = await this.repository.logicDelete(id);
            res.status(200).json(deletedEntity);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async restoreLogicDeleted(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const restoredEntity = await this.repository.restoreLogicDeleted(id);
            res.status(200).json(restoredEntity);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: any) {
        res.status(500).json({ message: error.message || "Ocurrió un error interno." });
    }
}