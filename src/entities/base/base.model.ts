import {
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	CreateDateColumn,
} from "typeorm";

//clase abstracta que no se mapea en base de datos, unicamente sirve para que las demas
//entidades hereden los atrubutos que aca se defienen.

export abstract class Base {
	@PrimaryGeneratedColumn("uuid")  //se usa el 'uuid' para tener ids unicos
	id!: string;

	@DeleteDateColumn({ nullable: true })
	deletedAt!: Date | null;

	@CreateDateColumn({ nullable: false })
	createdAt!: Date;

	/*  @UpdateDateColumn()
      updatedAt!: Date */
}
