import dotenv from 'dotenv';

import { IEloRepository } from '../interfaces/repositories/IEloRepository';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';

import { fetchAllCognitoUsers } from './services/cognito.service'

dotenv.config();

export async function initDB(user_repo: IUserRepository, elo_repo: IEloRepository) {

  try {
    let avatar_index = 0;
    const users = await fetchAllCognitoUsers(['email', 'sub']);

    for (const user of users) {
      const email = user.Attributes!.find(attr => attr.Name === 'email')?.Value;
      const cognito_id = user.Attributes!.find(attr => attr.Name === 'sub')?.Value;

      if (!email || !cognito_id) {
        // need to throw some error
        return;
      }

      // add user from cognito
      const inserted_user = await user_repo.createUser(user.Username!, email, cognito_id, ((avatar_index++) % 4), "Mercury")

      if (inserted_user) {
        // add default elo
        await elo_repo.createUserElo(inserted_user.user_id!)
      }

    }
  } catch (error) {
    console.error('Initialisation error ', error);
  }

}
