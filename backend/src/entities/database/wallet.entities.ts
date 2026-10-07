import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./user.entities";

export const STARTING_STARDUST = 1000;

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    wallet_id!: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id'})
    user!: Users;

    @Column('integer', {default: STARTING_STARDUST  })
    balance!: number;

    @UpdateDateColumn()
    updated_at!: Date;
}
