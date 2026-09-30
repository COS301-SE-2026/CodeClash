// backend/scripts/create-load-test-user.ts
import { AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito_identity_client } from '../src/application/usecases/services/cognito.service';
import { CreateUser } from '../src/application/usecases/services/user-creation.service';
import { UserRepository } from '../src/interface-adapters/repositories/user.repository';
import { EloRepository } from '../src/interface-adapters/repositories/elo.repository';
import { Users } from '../src/entities/db-entities/user.entities';
import { EloRatings } from '../src/entities/db-entities/elo.entities';
import { createTestDataSource } from '../tests/test-data-source'; // adjust path

const USERNAME = 'k6_load_test_user';
const EMAIL = 'k6loadtest@codeclash.dev';
const PASSWORD = 'LoadTest123!';

async function main() {
  await cognito_identity_client.send(new AdminCreateUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: USERNAME,
    MessageAction: 'SUPPRESS',
    UserAttributes: [
      { Name: 'email', Value: EMAIL },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'preferred_username', Value: USERNAME },
      { Name: 'name', Value: USERNAME },
    ],
  }));

  await cognito_identity_client.send(new AdminSetUserPasswordCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: USERNAME,
    Password: PASSWORD,
    Permanent: true,
  }));

  const data_source = await createTestDataSource();
  const users = new UserRepository(data_source.getRepository(Users));
  const elo = new EloRepository(data_source.getRepository(EloRatings));
  const create_user = new CreateUser(users, elo);
  await create_user.create(USERNAME, EMAIL);

  console.log('Load test user ready:', USERNAME, EMAIL);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });