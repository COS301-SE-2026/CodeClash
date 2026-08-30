import { Request, Response } from "express";
import { FriendService } from "src/application/usecases/services/friend.service";

export const getFriends = (service: FriendService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        if(!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try{
            const friends  = await service.getFriends(user_id);
            res.status(200).json(friends);
        }catch (error) {
            console.error('Error fetching friends:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

export const getFriendRequests = (service: FriendService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        const type = (req.query.type as 'sent' | 'received') ?? 'received';
        if(!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try{
            const requests = await service.getFriendRequests(user_id, type);
            res.status(200).json(requests);
        }catch (error) {
            console.error('Error fetching friend requests:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

export const sendFriendRequest = (service: FriendService) =>
    async (req: Request, res: Response): Promise<void> => {
        try{

        }catch (error: any) {

        }
    };

export const respondToFriendRequest = (service: FriendService) => 
    async (req: Request, res: Response): Promise<void> => {
        try{

        }catch (error) {

        }
    };

// copied structure
export const removeFriend = (service: FriendService) => 
    async (req: Request, res: Response): Promise<void> => {
        try{

        }catch (error) {

        }
    };

// copied structure
export const createInvite = (service: FriendService) => 
    async (req: Request, res: Response): Promise<void> => {
        try{

        }catch (error) {

        }
    };
