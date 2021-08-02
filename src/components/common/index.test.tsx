import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './index';
import SearchBar from './SearchBar';

test('simulate click', () => {
    const onClick = jest.fn();

    render(
        <Button text="click" onClick={onClick} />
    );

    fireEvent.click(screen.getByText("click"));
    expect(onClick).toHaveBeenCalled();
});

test('test search bar', () => {
    const setValue = jest.fn();

    render(
        <SearchBar label="Recherche" value="" setValue={setValue} />
    );

    fireEvent.change(screen.getByRole("search-bar"), {
        target: { value: "test" }
    });

    expect(setValue).toHaveBeenCalled();
});
