import {describe, it, beforeEach, vi, expect} from 'vitest';
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../../src/context/Auth/hooks/useAuth';
import { useLogOut } from '../../../src/ViewModels/ProfileViewModel';
import { useNavigate } from 'react-router';

const mock_nav = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mock_nav
}))

vi.mock('../../context/Auth/hooks/useAuth');

const signOut = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ signOut } as unknown as ReturnType<typeof useAuth>); //we need to sign out every time beacuse we are testing sign in
});

it('signs out and navigates to /welcome', async () => {

    const {result} = renderHook(() => useLogOut());

    await act(() => result.current());

    expect(signOut).toHaveBeenCalled();
    expect(mock_nav).toHaveBeenCalledWith('/welcome');
});

it('does not navigate if signOut throws an error', async () => {
    const {result} = renderHook(() => useLogOut());

    await act(() => result.current());

    expect(mock_nav).not.toHaveBeenCalled();
})