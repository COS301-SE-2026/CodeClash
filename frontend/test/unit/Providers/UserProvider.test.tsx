import { describe } from "vitest";
import { login, logout } from "root/testing/test-utils";
import { UserProvider } from "src/context/User/UserContext";
import { useUser } from "src/context/User/hooks/useUser";

const MockComponent: React.FC = () => {
   // const {username,elo,avatar_url,error,token} = useUser();

    return (
        <div>

        </div>
    )
}

describe("Tests user Provider", () => {
    it('Set Token', async () => {
        // login the test user
        await login();

        <UserProvider>
            <MockComponent/>
        </UserProvider>

        // after test
        await logout();
    })
})