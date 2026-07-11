import { fetchAuthSession, signIn, signOut } from "aws-amplify/auth";

export async function getToken() {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken

    return token;
}


export async function login() {
  try {
    await signIn({ username: process.env.INTEGRATION_TEST_USER!, password: process.env.INTEGRATION_TEST_PASS! })
  }
  catch (error) {
    console.log(`Error signing user in: ${error}`)
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