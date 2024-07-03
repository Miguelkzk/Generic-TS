import {
	EntityTarget,
	Repository,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { CustomError } from "../types";
import { Base } from "../entities/base/base.model";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class GenericRepository<T extends Base> extends Repository<T> {
	constructor(entity: EntityTarget<T>) {
		super(entity, AppDataSource.manager);
	}

	public async findAllEntities(): Promise<T[]> {
		try {
			const entities = await this.find();
			return entities;
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}

	public async findAllDeletedEntities(): Promise<T[]> {
		try {
			return await this.find({
				withDeleted: true,
			});
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}

	public async findByIdEntity(idEntity: string): Promise<T> {
		try {
			const entity = await this.findOneBy({
				id: idEntity as any,
			});

			if (entity) {
				return entity;
			} else {
				throw new CustomError("Entity not found", 404);
			}
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}

	public async createEntity(data: T): Promise<T> {
		try {
			const result = await this.save(data);
			return result;
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error: " + error, 500);
			}
		}
	}

	public async updateEntity(
		id: string,
		data: QueryDeepPartialEntity<T>
	): Promise<T | CustomError> {
		try {
			const entityUpdated = await this.update(id, data);

			if (entityUpdated.affected) {
				const restoredEntity = await this.findByIdEntity(id);
				return restoredEntity;
			} else {
				throw new CustomError("Entity not found", 404);
			}
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}

	public async deleteEntity(idEntity: string): Promise<T | CustomError> {
		try {
			const result = await this.delete(idEntity);

			if (result.affected) {
				return result.raw;
			} else {
				throw new CustomError("Entity not found", 404);
			}
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}

	public async logicDelete(id: string): Promise<T> {
		try {
			const result = await this.softDelete(id);

			if (result.affected) {
				return result.raw;
			} else {
				throw new CustomError("Entity not found", 404);
			}
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}

	public async restoreLogicDeleted(id: string): Promise<T> {
		try {
			const result = await this.restore(id);

			if (result.affected) {
				const restoredEntity = await this.findByIdEntity(id);
				return restoredEntity;
			} else {
				throw new CustomError("Entity not found", 404);
			}
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new CustomError("Unknown error" + error, 500);
			}
		}
	}
}
