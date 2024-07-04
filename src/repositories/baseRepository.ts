import { Repository, EntityTarget, DeepPartial, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Base } from '../entities/base';
import { AppDataSource } from '../AppDataSource';

interface FindOptionsWithDeleted<T> extends FindOneOptions<T> {
    withDeleted?: boolean;
}


export class BaseRepository<T extends Base> extends Repository<T> {
    constructor(entity: EntityTarget<T>) {
        super(entity, AppDataSource.manager);
    }

    public async findAllEntities(): Promise<T[]> {
        return this.find();
    }

    
    public async findByIdEntity(idEntity: string, includeDeleted: boolean = false): Promise<T> {
        const findOptions: FindOptionsWithDeleted<T> = {
            where: { id: idEntity } as any
        };
    
        if (includeDeleted) {
            findOptions.withDeleted = true;
        }
    
        return this.findOneOrFail(findOptions);
    }

    public async createEntity(data: DeepPartial<T>): Promise<T> {
        const entity = this.create(data);
        return this.save(entity);
    }

    public async updateEntity(idEntity: string, data: DeepPartial<T>): Promise<T | Error> {
        try {
            await this.update(idEntity, data as any);
            return this.findByIdEntity(idEntity);
        } catch (error) {
            return error as Error;
        }
    }

    public async deleteEntity(idEntity: string): Promise<T | Error> {
        try {
            const entity = await this.findByIdEntity(idEntity);
            await this.remove(entity);
            return entity;
        } catch (error) {
            return error as Error;
        }
    }

    public async logicDelete(idEntity: string): Promise<T> {
        const entity = await this.findByIdEntity(idEntity);
        entity.deletedAt = new Date();
        return this.save(entity);
    }

    public async restoreLogicDeleted(idEntity: string): Promise<T> {
        const entity = await this.findOne({ 
            where: { 
                id: idEntity as any // Directly pass idEntity without casting
            }, 
            withDeleted: true 
        });
    
        if (!entity) {
            throw new Error(`Entidad con ID ${idEntity} no encontrada o no está marcada como eliminada lógicamente`);
        }
    
        if (entity.deletedAt) {
            entity.deletedAt = null;
            try {
                return await this.save(entity);
            } catch (error) {
                throw new Error(`Error al restaurar la entidad con ID ${idEntity}: ${(error as Error).message}`);
            }
        } else {
            throw new Error(`La entidad con ID ${idEntity} no está marcada como eliminada lógicamente`);
        }
    }
    

    

}