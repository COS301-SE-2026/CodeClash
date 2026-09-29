import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./user.entities";

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    wallet_id!: string;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id '})
    user!: Users;

    @Column('integer', {default: 0 })
    balance!: number;

    @UpdateDateColumn()
    updated_at!: Date;
}
