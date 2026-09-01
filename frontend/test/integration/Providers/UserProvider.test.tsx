import { render, screen, waitFor } from "@testing-library/react";
import robot from 'src/assets/Robots/Pink_fighting.png'
import { AuthProvider } from "src/context/Auth/AuthContext";
import { useUser } from "src/context/User/hooks/useUser";
import { UserProvider } from "src/context/User/UserContext";
import { robot_map } from 'src/assets/Robots'
import { beforeAll, afterAll, describe, beforeEach, vi } from "vitest";

import { getToken, login, logout } from "../../test-utils";


const MockComponent: React.FC = () => {
    const { username, elo, avatar, error } = useUser();

    return (
        <div>
            <div data-testid='elo-test'>
                {elo}
            </div>
            <div data-testid='username-test'>
                {username}
            </div>
            <div data-testid='avatar-test'>
                {avatar}
            </div>
            <div data-testid='error-test'>
                {error}
            </div>

        </div>
    )
}

describe("Tests user Provider", () => {

    beforeAll(async () => {
        // login the test user
        await login();
    })

    beforeEach(async () => {

        render(
            <AuthProvider>
                <UserProvider>
                    <MockComponent />
                </UserProvider>
            </AuthProvider>
        )

    })

    afterAll(async () => {
        // after test
        await logout();
    })


    it("Set Elo", async () => {
        const expected = 600;   // default elo 

        await waitFor(() => {
            expect(screen.getByTestId('elo-test')).toHaveTextContent(expected.toString());
        }, {timeout: 10000})
    })

    it("Set Username", async () => {
        const expected = `${process.env.VITE_INTEGRATION_TEST_USER}`;

        await waitFor(() => {
            expect(screen.getByTestId('username-test')).toHaveTextContent(expected);
        }, {timeout : 10000})
    })

    it("Set Avatar", async () => {
        const expected = robot;

        await waitFor(() => {
            expect(robot_map).toContain(screen.getByTestId('avatar-test').textContent);
        }, { timeout: 10000})
    })

})