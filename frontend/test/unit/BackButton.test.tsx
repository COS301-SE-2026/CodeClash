import { render, screen} from '@testing-library/react';
import { describe, it, expect, vi} from "vitest";
import BackButton from '../../@/components/shared/BackButton';
import { MemoryRouter } from 'react-router-dom';

describe('BackButton click Test', () => {
    it('execute onClick function', () => {
        render(
            <MemoryRouter>
                <BackButton page='/nav'></BackButton>
            </MemoryRouter>
        )


        expect(screen.getByRole('link')).toHaveAttribute('href',"/nav")
        
    })
})