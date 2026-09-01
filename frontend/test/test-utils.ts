import '../src/amplify-config'
import { fetchAuthSession, signIn, signOut } from "aws-amplify/auth";

const env = import.meta.env;

export async function getToken() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString()

  return token;
}


export async function login() {
  try {
    await signIn({ username: env.VITE_INTEGRATION_TEST_USER!, password: env.VITE_INTEGRATION_TEST_PASS! })
  }
  catch (error) {
    // console.log(`Error signing user in: ${error}`)
    throw new Error(`Error signing user in: ${error}`, {cause: error})
  }

}

export async function logout() {
  try {
    await signOut();
  }
  catch (error) {
    console.log(`Error signing user out: ${error}`)
  }
}