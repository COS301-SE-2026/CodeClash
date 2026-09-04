import { getOriginalPosition } from 'vitest/internal/browser';
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
<<<<<<< HEAD
  catch (error: any) {

    if (error.name === 'NotAuthorizedError') {
      console.error("Incorrect username or password")
      throw new Error ("Incorrect username or password", { cause: error})
    }

    throw error
=======
  catch (error) {
    // console.log(`Error signing user in: ${error}`)
    throw new Error(`Error signing user in: ${error}`, {cause: error})
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
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