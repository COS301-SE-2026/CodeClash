
import { describe, expect, it } from "vitest"
import { fetchCognitoUser, fetchCognitoId } from "../../../../src/application/usecases/services/cognito.service"


const test_user_id = "e0cc896c-3001-70cf-8699-ec36ef0d9ce1"
const test_user_email = "skwandem@gmail.com"

describe("Tests Cognito services", () => {
    it("Fetches attributes of a user with their id", async () => {
        const user = await fetchCognitoUser(["email"], test_user_id);
        expect(user).toBeDefined();
        expect(user?.length).toEqual(1);

        const email = (user![0]).Attributes!.find(attr => attr.Name === "email")?.Value;

        expect(email).toEqual(test_user_email);

    })

    it("Fetched cognito user id from given emial", async () => {
        const user = await fetchCognitoId(test_user_email);

        expect(user).toBeDefined();
        expect(user?.length).toEqual(1);

        const id = (user![0]).Attributes!.find(attr => attr.Name === "sub")?.Value;

        expect(id).toEqual(test_user_id);
    })
})