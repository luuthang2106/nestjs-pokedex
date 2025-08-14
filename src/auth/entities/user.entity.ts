import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('users')
@Unique(['username'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    username: string;

    @Column()
    password: string;
}
