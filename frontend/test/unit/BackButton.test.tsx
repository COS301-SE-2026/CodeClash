import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../../@/components/shared/BackButton';

describe('BackButton click Test', () => {
    it('execute onClick function', () => {
        const click = vi.fn();
        render(<BackButton onClick={click}></BackButton>)

        fireEvent.click(screen.getByRole('button'))
        expect(click).toHaveBeenCalled();
    })
})