import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user.entities';

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

@Entity('friendships')
export class Friendship {

}

@Entity('friend_invites')
export class FriendInvite {
    
}