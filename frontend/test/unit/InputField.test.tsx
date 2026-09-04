import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from "vitest";

import InputField from '../../@/components/shared/InputField';
import "@testing-library/jest-dom";

describe('InputField', () => {
    it('renders with correct placeholder', () => {
        render(
            <InputField
                name='test-input'
                type="text"
                placeholder="TESTING"
                value=""
                onChange={vi.fn()}
                autoComplete="auto">
            </InputField>
        );
        expect(screen.getByPlaceholderText('TESTING')).toBeInTheDocument();
    })

    it('changes correctly when typed', () => {
        const change = vi.fn();
        render(<InputField
            name='test-input'
            type="text"
            placeholder="change test"
            value=""
            onChange={change}
            autoComplete="auto"
        >
        </InputField>)

        fireEvent.change(screen.getByPlaceholderText('change test'), {target: {value: 'test'}})
        expect(change).toHaveBeenCalled();
    })

    it('has correct input type', ()=>{
        render(<InputField
        name='type-test'
        type='email'
        placeholder="type test"
        value="example@gmail.com"
        onChange={vi.fn()}
        >
        </InputField>)
        expect(screen.getByPlaceholderText('type test')).toHaveAttribute('type','email');
    })
})