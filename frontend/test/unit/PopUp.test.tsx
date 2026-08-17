import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from "vitest";

import PopUp from '../../src/Views/Popup'

const mock_nav = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mock_nav
}))

const mock_select_topic = vi.fn();
vi.mock('src/ViewModels/PopUpViewModel', () => ({
    useSelectTopic: () => mock_select_topic
}))

describe("PopUp", () => {
    it('Checks that popup opens', () => {
        render(<PopUp
            isOpen={true}
            onClose={vi.fn()}
        >
        </PopUp>)

        expect(screen.getByText('Choose a Topic')).toBeInTheDocument();

    })

    it('Check that popup closes', () => {
        render(<PopUp
            isOpen={false}
            onClose={vi.fn()}
        >
        </PopUp>)

        expect(screen.queryByText('Choose a Topic')).toBeNull();
    })

    it('Checks onClose is working', () => {
        const click = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={click}
        >
        </PopUp>)

        fireEvent.click(screen.getByRole('button', { name: 'cancel' }))
        expect(click).toHaveBeenCalled();
    })


    it('Checks the Escape key closes', () => {
        const esc = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={esc}
        ></PopUp>)

        fireEvent.keyDown(screen.getByLabelText('cancel'), { key: 'Esc' })
        expect(esc).toHaveBeenCalled()
    })

    it('Closes when cancel is clicked', () => {
        const cancel = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={cancel}
        ></PopUp>)

        fireEvent.click(screen.getByRole('button', { name: 'cancel' }))
        expect(cancel).toHaveBeenCalled()
    })

    it("Selects maths topic", () => {
        render(<PopUp
            isOpen={true}
            onClose={vi.fn()}
        ></PopUp>)

        fireEvent.click(screen.getByRole('button', { name: 'math-selector' }))
        expect(mock_select_topic).toHaveBeenCalledWith('maths');
    })

    it("Selects programming topic", () => {
        render(<PopUp
            isOpen={true}
            onClose={vi.fn()}
        ></PopUp>)

        fireEvent.click(screen.getByRole('button', { name: 'prog-selector' }))
        expect(mock_select_topic).toHaveBeenCalledWith('programming');
    })
})