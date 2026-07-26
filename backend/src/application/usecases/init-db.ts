import dotenv from 'dotenv';
import { fetchAllCognitoUsers } from './services/cognito.service'
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { IEloRepository } from '../interfaces/repositories/IEloRepository';

dotenv.config();

export async function initDB(user_repo: IUserRepository, elo_repo: IEloRepository) {

  try {
    const users = await fetchAllCognitoUsers(['name', 'email', 'sub']);

    for (const user of users) {
      const user_name = user.Attributes!.find(attr => attr.Name === 'name')?.Value;
      const email = user.Attributes!.find(attr => attr.Name === 'email')?.Value;
      const cognito_id = user.Attributes!.find(attr => attr.Name === 'sub')?.Value;

      if (!user_name || !email || !cognito_id) {
        // need to throw some error
        return;
      }

      // add user from cognito
      const inserted_user = await user_repo.createUser(user_name, email, cognito_id, 0, "Mercury")

      if (inserted_user) {
        // add default elo
        await elo_repo.createUserElo(inserted_user.user_id!)
      }



    }
  } catch (error) {
    console.error('Initialisation error ', error);
  }

}
