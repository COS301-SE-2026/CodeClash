import { Request, Response } from "express"
import { pool } from "src/application/usecases/init-db"

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
    const email = req.user.email;
    const { league } = req.params;
    const {elo, count} = req.query;
    if (email === null) return;

    try {
        const result = await pool.query(`
            `)

    } catch (error) {

    }

}

