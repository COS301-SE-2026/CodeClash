import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./user.entities";


@Entity()
export class EloRatings {
    @PrimaryGeneratedColumn('uuid')
    elo_id!: string

    @OneToOne(() => Users)
    @JoinColumn({name: 'user_id'})
    user!: Users

    @Column({ nullable: false })
    rating!: number

    // this is important for leaving a paper trail of elo history
    @UpdateDateColumn()
    updated_at!: Date;
}

@Entity()
export class EloHistory {
    @PrimaryGeneratedColumn('uuid')
    history_id!: string

    @ManyToOne(() => Users)
    user!: Users

}