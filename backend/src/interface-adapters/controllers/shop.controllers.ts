import { Request, Response } from 'express';
import { ShopService } from 'src/application/usecases/services/shop-item.service'; // coming soon :P
import { UpdatedEquippedDTO } from 'src/entities/dtos/shop/equipped-items.dto';

export const getAllItems = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        try {
            const items = await service.getAllItems();
            res.status(200).json(items);
        } catch (error) {
            console.error ('Error fetching shop items:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

export const getUserItems = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try {
            const items = await service.getUserItems(user_id);
            res.status(200).json(items);
        } catch (error) {
            console.error ('Error fetching user items:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
};

export const purchaseItem = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        const { shop_item_id } = req.body;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        if (!shop_item_id) { res.status(400).json({ message: 'shop_item_id is required' }); return; }
        try {
            const result = await service.purchaseItem(user_id, shop_item_id);
            res.status(201).json(result);
        } catch (error) {
            console.error ('Error purchasing item :', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

export const getWallet = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try {
            const wallet = await service.getWallet(user_id);
            res.status(200).json(wallet);
        } catch (error) {
            console.error ('Error fetching wallet:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

export const getEquipped = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try {
            const equipped = await service.getEquipped(user_id);
            res.status(200).json(equipped);
        } catch (error) {
            console.error ('Error fetching equipped items:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

export const updateEquipped = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        const updates: UpdatedEquippedDTO = req.body;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try {
            const equipped = await service.updateEquipped(user_id, updates);
            res.status(200).json(equipped);
        } catch (error: any) {
            console.error ('Error updating equipped items:', error);
            const status = error.message === 'Item not owned' ? 403 : 500;
            res.status(status).json({ message: error.message ??'Internal server error' });
        }
    };

export const getUserPowerups = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        try {
            const powerups = await service.getUserPowerups(user_id);
            res.status(200).json(powerups);
        } catch (error) {
            console.error ('Error fetching user powerups:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

export const usePowerup = (service: ShopService) => 
    async (req: Request, res: Response): Promise<void> => {
        const user_id = req.user?.id;
        const { match_id, shop_item_id, target_user_id } = req.body;
        if (!user_id) { res.status(401).json({ message: 'Unauthorized' }); return; }
        if (!match_id || !shop_item_id) { res.status(400).json({ message: 'match_id and shop_item_id are required' }); return; }
        try {
            const result = await service.usePowerup(user_id, match_id, shop_item_id, target_user_id);
            res.status(200).json(result);
        } catch (error: any) {
            console.error ('Error using powerup:', error);
            const status = error.message === 'Pwerup not owned' ? 403
                : error.message === 'Match not found' ? 404
                : 500
            res.status(500).json({ message: error.message ?? 'Internal server error' });
        }
    };