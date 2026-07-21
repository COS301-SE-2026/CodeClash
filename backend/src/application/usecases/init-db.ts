import dotenv from 'dotenv';
import { fetchAllCognitoUsers } from './services/cognito.service'
import { IUserRepository } from '../interfaces/IUserRepository';
import { IEloRepository } from '../interfaces/IEloRepository';

dotenv.config();

export async function initDB(user_repo: IUserRepository, elo_repo: IEloRepository) {

  try {
    const users = await fetchAllCognitoUsers(['name', 'email']);

    for (const user of users) {
      const user_name = user.Attributes!.find(attr => attr.Name === 'name')?.Value;
      const email = user.Attributes!.find(attr => attr.Name === 'email')?.Value;

      if (!user_name || !email) {
        // need to throw some error
        return;
      }

      // add user from cognito
      const inserted_user = await user_repo.createUser(user_name, email, 0, "Mercury")

      if (inserted_user) {
        // add default elo
        await elo_repo.createUserElo(inserted_user.user_id!)
      }



    }
  } catch (error) {
    console.error('Initialisation error ', error);
  }

}
