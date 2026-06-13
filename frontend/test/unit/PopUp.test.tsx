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

        expect(screen.getByRole('button',{name: 'outer-div'})).toBeInTheDocument();
    })

    it('Check that popup closes', ()=>{
        render(<PopUp
            isOpen={false}
            onClose={vi.fn()}
            onSelectTopic={vi.fn()}
        >
        </PopUp>)

        expect(screen.queryByRole('button',{name: 'outer-div'})).toBeNull();
    })

    it('Checks onClose is working', ()=>{
        const click = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={click}
            onSelectTopic={vi.fn()}
        >
        </PopUp>)

        fireEvent.click(screen.getByRole('button',{name: 'outer-div'}))
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

        fireEvent.keyDown(screen.getByRole('button',{name: 'outer-div'}), {key: 'Enter'})
        expect(enter).toHaveBeenCalled();
    })

    it('Checks the Escape key closes', ()=>{
        const esc = vi.fn();
        render(<PopUp
            isOpen={true}
            onClose={esc}
            onSelectTopic={vi.fn()}
        ></PopUp>)

        fireEvent.keyDown(screen.getByLabelText('Choose a topic'), {key: 'Escape'})
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

        fireEvent.click(screen.getByRole('button',{name: 'topic-math'}))
        expect(maths).toHaveBeenCalled();
    })

    it("Checks cancel button closes", ()=>{
        const cancel = vi.fn()
        render(<PopUp
        isOpen={true}
        onClose={cancel}
        onSelectTopic={vi.fn()}
        ></PopUp>)

        fireEvent.click(screen.getByRole('button', {name: 'cancel-button'}))
        expect(cancel).toHaveBeenCalled();
    })
})