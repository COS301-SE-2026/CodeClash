import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../../@/components/shared/BackButton';

describe('BackButton click Test', () => {
    it('execute onClick function', () => {
        const click = vi.fn();
        render(<BackButton onClick={click} data-tesid='back-button-test'></BackButton>)

        fireEvent.click(screen.getByTestId('back-button-test'))
        expect(click).toHaveBeenCalled();
    })
})