import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user.entities';

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

@Entity('friendships')
export class Friendship {
    @PrimaryGeneratedColumn('uuid')
    friendship_id!: string;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'requester_id' })
    requester!: Users;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'receiver_id' })
    receiver!: Users;

    @Column({
        type: 'enum',
        enum: ['pending', 'accepted', 'declined', 'blocked'],
        default: 'pending'
    })
    status!: FriendshipStatus;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}

@Entity('friend_invites')
export class FriendInvite {

}