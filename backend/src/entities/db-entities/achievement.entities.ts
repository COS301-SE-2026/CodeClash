import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Users } from './user.entities';

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn('uuid')
    achievement_id!: string;

    @Column({ length: 30 })
    achievement_name!: string;

    @Column({ length:70 })
    description!: string;

    @CreateDateColumn()
    earned_at!: Date;

    @ManyToMany(() => Users, user => user.achievements)
    @JoinTable({ 
        name: 'players_achievements',
        joinColumn: { name: 'achievemnt_id' },
        inverseJoinColumn: { name: 'user_id' }
    })
    users!: Users[]
}