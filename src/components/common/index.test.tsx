import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './index';

test('simulate click', () => {
    const onClick = jest.fn();

    render(
        <Button text="click" onClick={onClick} />
    );

    fireEvent.click(screen.getByText("click"));
    expect(onClick).toHaveBeenCalled();
});
