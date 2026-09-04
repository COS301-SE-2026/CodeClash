import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { Users } from './user.entities';

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

