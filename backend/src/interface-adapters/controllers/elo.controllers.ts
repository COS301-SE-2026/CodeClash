import { Request, Response } from 'express';
import { EloRepository } from '../repositories/elo.repository';


// GET /api/elo/elo-get
// Get current elo rating for a user
export const getUserElo = (elo_repo: EloRepository) => {

  return async (req: Request, res: Response)=>{
      const elo = await elo_repo.getElo(req.user.id);

      if(!elo){
        res.status(404).json({error: 'User not found'})
        return
      }

      res.status(200).json(elo);

  }
};

// GET /api/elo/:user_id/history
// Get full elo history for a user
export const getEloHistory = async (req: Request, res: Response): Promise<void> => {
  // const email = req.user.email;

  // if (email === null) return;
  // try {
  //   const result = await pool.query(
  //     `SELECT 
  //       eh.match_id,
  //       eh.new_rating,
  //       eh.change,
  //       eh.changed_at
  //      FROM elo_history eh
  //      JOIN users u ON eh.user_id = u.user_id
  //      WHERE u.email = $1
  //      ORDER BY eh.changed_at DESC`,
  //     [email]
  //   );

  //   if (result.rows.length === 0) {
  //     res.status(404).json({ message: 'No elo history found for this user' });
  //     return;
  //   }

  //   res.status(200).json(result.rows);

  // } catch (error) {
  //   console.error('Error fetching elo history:', error);
  //   res.status(500).json({ message: 'Internal server error' });
  // }
};

// POST /api/elo/update
// Update elo ratings for both players after a ranked match
// Uses the standard Elo formula
export const updateEloAfterMatch = async (req: Request, res: Response): Promise<void> => {
  // const { match_id, winner_id, loser_id } = req.body;

  // if (!match_id || !winner_id || !loser_id) {
  //   res.status(400).json({ message: 'match_id, winner_id and loser_id are required' });
  //   return;
  // }

  // const client = await pool.connect();

  // try {
  //   await client.query('BEGIN');

  //   // Check match exists and is ranked
  //   const matchResult = await client.query(
  //     `SELECT * FROM matches WHERE match_id = $1`,
  //     [match_id]
  //   );

  //   if (matchResult.rows.length === 0) {
  //     res.status(404).json({ message: 'Match not found' });
  //     return;
  //   }

  //   const match = matchResult.rows[0];

  //   if (match.mode !== 'ranked') {
  //     res.status(400).json({ message: 'Elo is only updated for ranked matches' });
  //     return;
  //   }

  //   // Get current elo ratings for both players
  //   const winnerEloResult = await client.query(
  //     `SELECT * FROM elo_ratings WHERE user_id = $1`,
  //     [winner_id]
  //   );

  //   const loserEloResult = await client.query(
  //     `SELECT * FROM elo_ratings WHERE user_id = $1`,
  //     [loser_id]
  //   );

  //   if (winnerEloResult.rows.length === 0 || loserEloResult.rows.length === 0) {
  //     res.status(404).json({ message: 'Elo rating not found for one or both players' });
  //     return;
  //   }

  //   const winnerRating = winnerEloResult.rows[0].rating;
  //   const loserRating = loserEloResult.rows[0].rating;

  //   // Standard Elo formula
  //   const K = 32; // K-factor, how much ratings change per match
  //   const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  //   const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

  //   const newWinnerRating = Math.round(winnerRating + K * (1 - expectedWinner));
  //   const newLoserRating = Math.round(loserRating + K * (0 - expectedLoser));

  //   const eloGained = newWinnerRating - winnerRating;
  //   const eloLost = loserRating - newLoserRating;

  //   // Update winner elo
  //   await client.query(
  //     `UPDATE elo_ratings 
  //      SET rating = $1, updated_at = NOW() 
  //      WHERE user_id = $2`,
  //     [newWinnerRating, winner_id]
  //   );

  //   // Update loser elo
  //   await client.query(
  //     `UPDATE elo_ratings 
  //      SET rating = $1, updated_at = NOW() 
  //      WHERE user_id = $2`,
  //     [newLoserRating, loser_id]
  //   );

  //   // Insert elo history for winner
  //   await client.query(
  //     `INSERT INTO elo_history (user_id, match_id, old_rating, new_rating)
  //      VALUES ($1, $2, $3, $4)`,
  //     [winner_id, match_id, winnerRating, newWinnerRating]
  //   );

  //   // Insert elo history for loser
  //   await client.query(
  //     `INSERT INTO elo_history (user_id, match_id, old_rating, new_rating)
  //      VALUES ($1, $2, $3, $4)`,
  //     [loser_id, match_id, loserRating, newLoserRating]
  //   );

  //   // Update match log
  //   await client.query(
  //     `INSERT INTO match_log (match_id, winner_id, loser_id, elo_gained, elo_lost)
  //      VALUES ($1, $2, $3, $4, $5)`,
  //     [match_id, winner_id, loser_id, eloGained, eloLost]
  //   );

  //   await client.query('COMMIT');

  //   res.status(200).json({
  //     message: 'Elo ratings updated successfully',
  //     winner: {
  //       user_id: winner_id,
  //       old_rating: winnerRating,
  //       new_rating: newWinnerRating,
  //       elo_gained: eloGained
  //     },
  //     loser: {
  //       user_id: loser_id,
  //       old_rating: loserRating,
  //       new_rating: newLoserRating,
  //       elo_lost: eloLost
  //     }
  //   });

  // } catch (error) {
  //   await client.query('ROLLBACK');
  //   console.error('Error updating elo ratings:', error);
  //   res.status(500).json({ message: 'Internal server error' });
  // } finally {
  //   client.release();
  // }
};

// POST /api/elo
// sets user elo 
export const setUserElo = async (req: Request, res: Response): Promise<void> => {
  // const { user_id } = req.body;

  // console.log("setting user elo")
  // const client = await pool.connect();

  // console.log("pool connected")

  // try {
  //   await client.query('BEGIN');

  //   await client.query(
  //     `INSERT INTO elo_ratings (user_id)
  //   VALUES ($1)
  //   ON CONFLICT DO NOTHING`,
  //     [user_id]
  //   )

  //   await client.query('COMMIT');

  //   res.status(200).json({ message: 'successfully set elo' })

  // } catch (error) {
  //   await client.query('ROLLBACK');
  //   console.error('Error setting elo', error);
  //   res.status(500).json({ message: 'Internal Server Error' })

  // } finally {
  //   client.release();
  // }
}

// GET /api/elo/leaderboard
// Get top 10 players by elo rating
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  // try {
  //   const result = await pool.query(
  //     `SELECT 
  //       u.user_id,
  //       u.username,
  //       e.rating,
  //       e.updated_at,
  //       RANK() OVER (ORDER BY e.rating DESC) AS rank
  //      FROM elo_ratings e
  //      JOIN users u ON u.user_id = e.user_id
  //      ORDER BY e.rating DESC
  //      LIMIT 10`
  //   );

  //   res.status(200).json(result.rows);

  // } catch (error) {
  //   console.error('Error fetching leaderboard:', error);
  //   res.status(500).json({ message: 'Internal server error' });
  // }
};