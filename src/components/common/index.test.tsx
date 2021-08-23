import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Button,
    SearchBar,
    Profile
} from './index';

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

test('test profile component', () => {
    render(
        <Profile elements={[
            <p>Test text</p>
        ]} />
    );

    expect(screen.getByText('Test text')).toBeInTheDocument();
});