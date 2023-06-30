import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
    //Primary Key & auto increment
    @PrimaryGeneratedColumn()
    uid: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: String;
}