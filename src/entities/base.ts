import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class Base{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @DeleteDateColumn()
    deletedAt!: Date | null;

    @CreateDateColumn({nullable: false})
    createdAt!: Date;
}