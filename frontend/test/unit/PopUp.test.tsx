import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';
import PopUp from '../../@/components/shared/PopUp'


describe("PopUp", () => {
    it('Checks that popup opens', () => {
        render(<PopUp
            isOpen={true}
            onClose={vi.fn()}
            onSelectTopic={vi.fn()}
        >
        </PopUp>)

        expect(screen.getByLabelText('outer-div')).toBeInTheDocument();
    })

    it('Check that popup closes', ()=>{
        render(<PopUp
            isOpen={false}
            onClose={vi.fn()}
            onSelectTopic={vi.fn()}
        >
        </PopUp>)

        expect(screen.getByLabelText('outer-div')).toBeNull();
    })

    it('Checks onClose is working', ()=>{
        const click = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={click}
            onSelectTopic={vi.fn()}
        >
        </PopUp>)

        fireEvent.click(screen.getByLabelText('outer-div'))
        expect(click).toHaveBeenCalled();
    })

    it('Check enter key closes', ()=>{
        const enter = vi.fn();
        render(<PopUp
        isOpen={true}
        onClose={enter}
        onSelectTopic={vi.fn()}
        >
        </PopUp>)

        fireEvent.keyDown(screen.getByLabelText('outer-div'), {key: 'Enter'})
        expect(enter).toHaveBeenCalled();
    })

    it('Checks the Escape key closes', ()=>{
        const esc = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={esc}
            onSelectTopic={vi.fn()}
        ></PopUp>)

        fireEvent.keyDown(screen.getByLabelText('outer-div'), {key: 'Escape'})
        expect(esc).toHaveBeenCalled()
    })

    it('Closes when X is clicked', ()=>{
        const x = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={x}
            onSelectTopic={vi.fn()}
        ></PopUp>)

        fireEvent.click(screen.getByText('X'))
        expect(x).toHaveBeenCalled()
    })

    it("Selects maths topic", ()=>{
        const maths = vi.fn()
        render(<PopUp
        isOpen={true}
        onClose={vi.fn()}
        onSelectTopic={maths}
        ></PopUp>)

        fireEvent.click(screen.getByLabelText('topic-button'))
    })
})