import { Entity, PrimaryGeneratedColumn, Column,ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Users } from "./user.entities";
import { ShopItem } from "./shop-item.entities";


// Gonna put a hold on this for now since we don't incorporate transactions record keeping anywhere