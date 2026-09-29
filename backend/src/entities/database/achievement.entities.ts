import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './user.entities';

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn('uuid')
    achievement_id!: string;

    @Column({ length: 30 })
    achievement_name!: string;

    @Column({ length: 70 })
    description!: string;

    @ManyToMany(() => Users, user => user.achievements)
    @JoinTable({
        name: 'player_achievements',
        joinColumn: { name: 'achievement_id' },
        inverseJoinColumn: { name: 'user_id' }
    })
    users!: Users[]
}

// @Entity('player_achievements')
// export class PlayerAchievements {
//     @PrimaryColumn('uuid')
//     user_id!: string

//     @PrimaryColumn('uuid')
//     achievement_id!: string

//     @ManyToOne(() => Users)
//     @JoinColumn({ name: 'user_id' })
//     user!: Users

//     @ManyToOne(() => Achievement)
//     @JoinColumn({ name: 'achievement_id' })
//     achievement!: Achievement

//     @Column({ type: 'timestamp', default: () => 'NOW()' })
//     earned_at!: Date
// }