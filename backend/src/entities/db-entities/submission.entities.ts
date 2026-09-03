import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Users } from './user.entities';
import { Matches } from './match.entities';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn('uuid')
        submission_id!: string;

    @OneToOne(() => Matches)
    @JoinColumn({ name: 'match_id' })
    match!: Matches;
    
    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user!: Users;

    @Column()
    question_id!: string;

    @Column({ nullable: true })
    answer!: string;

    @Column({ default: 'Pending' })
    status!: 'Pending' | 'Correct' | 'Incorrect' | 'Error'; 

    @CreateDateColumn()
    submitted_at!: Date;
}