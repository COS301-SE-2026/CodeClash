import dotenv from 'dotenv';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';

import { fetchAllCognitoUsers } from './services/cognito.service'

dotenv.config();

export async function initDB(user_repo: IUserRepository) {

  try {
    let avatar_index = 0;
    const users = await fetchAllCognitoUsers(['email', 'sub']);

    for (const user of users) {
      const email = user.Attributes!.find(attr => attr.Name === 'email')?.Value;
      const cognito_id = user.Attributes!.find(attr => attr.Name === 'sub')?.Value;

      if (!email || !cognito_id) {
        console.warn(`Skipping user ${user.Username} — missing email or cognito_id`);
        continue;
      }

      // add user from cognito
      await user_repo.createUser(user.Username!, email, cognito_id, ((avatar_index++) % 4), "Mercury")

    }
  } catch (error) {
    console.error('Initialisation error ', error);
  }

}
