import {
	EntityTarget,
	//FindOneOptions,
	//FindOptionsWhere,
	Repository,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { CustomError } from "../types";
import { Base } from "../entities/base/base.model";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

 class GenericRepository<T extends Base> extends Repository<T> {
	constructor(entity: EntityTarget<T>) {
		super(entity, AppDataSource.manager);
	}

	/**
	 * La función `findAllEntities` es una función asincrónica que toma `whereOptions` y `opciones` como
	 * parámetros y devuelve una promesa que se resuelve en una matriz de entidades o un objeto
	 * 'CustomError`.
	 * @param whereOptions - El parámetro `whereOptions` es un objeto que especifica las condiciones para
	 * filtrar las entidades a recuperar. Puede incluir atributos y sus correspondientes valores para
	 * comparar en la consulta de la base de datos.
	 * @param {FindOptions} options - El parámetro `opciones` es un objeto que contiene información
	 * adicional opciones para la consulta. Estas opciones pueden incluir cosas como clasificación,
	 * paginación e incluir/excluir ciertos atributos del conjunto de resultados.
	 * @returns una Promesa que se resuelve en una matriz de entidades de tipo T o en un objeto
	 * CustomError
	 */
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

	/**
	 * La función `findAllDeletedEntities` es una función asincrónica que recupera todas las entidades
	 * eliminadas, basadas en las opciones proporcionadas y devuelve una matriz de entidades o un objeto
	 * `CustomError`.
	 * @param {FindOptions} options - El parámetro `options` es un objeto que contiene información
	 * adicional para encontrar entidades eliminadas. Puede incluir propiedades como "where", "order",
	 * `limit` y `offset` para especificar las condiciones y el orden de los resultados de la consulta.
	 * @returns La función `findAllDeletedEntities` devuelve una promesa que se resuelve en una matriz de
	 * entidades `T[]` o un objeto `CustomError`.
	 */
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

	/**
	 * Esta función encuentra una entidad por su ID y la devuelve, o devuelve un error personalizado si
	 * la entidad no se encuentra o se produce un error.
	 * @param {string} id - El parámetro `id` es una cadena que representa el identificador único de
	 * la entidad que deseas encontrar.
	 * @returns una Promesa que se resuelve en una instancia de tipo T o en un objeto CustomError.
	 */
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

	/**
	 * Esta función crea una entidad utilizando los datos proporcionados y devuelve la entidad creada
	 * o un error personalizado.
	 * @param data - El parámetro `data` es de tipo `MakeNullishOptional<T["_creationAttributes"]>` y
	 * refiere los datos de la entidad que desea ser guardada
	 * @returns La función `createEntity` devuelve una Promesa que se resuelve en una instancia de
	 * la entidad `T` o una instancia de `CustomError`.
	 */
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

	/**
	 * La función `updateEntity` actualiza una entidad con el ID y los datos proporcionados, devolviendo
	 * la información actualizada de la entidad o un error personalizado.
	 * @param {string} id - El parámetro `id` es una cadena que representa el identificador único de la
	 * entidad que desea actualizar.
	 * @param data - El parámetro `data` es de tipo `Partial<T>`, lo que significa que es un objeto que
	 * contiene propiedades parciales de tipo `T`. La "T" representa el tipo de entidad que se está
	 * actualizando.
	 * @returns una Promesa que se resuelve en una instancia de tipo T (la entidad actualizada) o en una
	 * instancia de CustomError.
	 */
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

	/**
	 * La función `deleteEntity` es una función asincrónica que elimina una entidad de una base de datos
	 * basada en el ID proporcionado y devuelve el número de filas afectadas o un objeto error
	 * personalizado.
	 * @param {string} id - El parámetro `id` es una cadena que representa el identificador único de la
	 * entidad que necesita ser eliminada.
	 * @returns La función `deleteEntity` devuelve una `Promise` que se resuelve en un número o en un
	 * `Error personalizado`.
	 */
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

	/**
	 * La función logicDelete elimina de forma logica una entidad de una tabla de base de datos según su
	 * ID y devuelve el número de filas afectadas o un objeto de error personalizado.
	 * @param {string} id - El parámetro `id` es una cadena que representa el identificador único de la
	 * entidad que necesita ser eliminada.
	 * @returns La función devuelve una `Promise` que se resuelve en un número o en un
	 * `Error personalizado`.
	 */
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

	/**
	 * La función `restoreLogicDeleted` restaura una entidad eliminada logicamente por su ID y devuelve
	 * la entidad restaurada o un error personalizado.
	 * @param {string} id - El parámetro `id` es una cadena que representa el identificador único de la
	 * entidad que necesita ser restaurada.
	 * @returns La función `restoreLogicDeleted` devuelve una Promesa que se resuelve en un instancia de
	 * tipo `T` o una instancia de `CustomError`.
	 */
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
