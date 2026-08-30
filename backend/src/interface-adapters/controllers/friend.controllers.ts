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
        const requester_id = req.user?.id;
        const { receiver_id } = req.body;
        if(!requester_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        if (!receiver_id) { res.status(400).json({ message: 'receiver_id is required' }); return; }
        try{
           await service.sendFriendRequests(requester_id, receiver_id);
            res.status(200).json({ message: 'Friend request sent' });
        }catch (error: any) {
            console.error('Error sending friend requests:', error);
            const status = error.message.includes('already exists') ? 409 : 500;
            res.status(status).json({message: error.message});
        }
    };

export const respondToFriendRequest = (service: FriendService) => 
    async (req: Request, res: Response): Promise<void> => {
        const { friendship_id } = req.params;
        const { status } = req.body;
        if(!friendship_id || Array.isArray(friendship_id)) { res.status(400).json({ message: 'friendship_id is required' }); return; }
        
        if(!['accepted', 'declined'].includes(status)){
            res.status(400).json({ message: 'status must be accepted or decliend' });
            return;
        }
        try{
            await service.respondToRequest(friendship_id, status);
            res.status(200).json({ message: `Friend requests ${status}`});
        }catch (error) {
             console.error('Error responding to friend requests:', error);
            res.status(500).json({message: 'Internal server error'});
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
