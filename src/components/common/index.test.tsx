import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './index';
import { TextInput } from './index';
import { Dropdown } from './index';
import SearchBar from './SearchBar';

test('simulate click', () => {
    const onClick = jest.fn();

    render(
        <Button text="click" onClick={onClick} />
    );

    fireEvent.click(screen.getByText("click"));
    expect(onClick).toHaveBeenCalled();
});

test('simulate TextInput', () => {
    const setValue = jest.fn();
    render(
        <TextInput type="test" role="test" value="" setValue={setValue} label="test"/>
    );
    const TextInputTest = screen.getByRole("test")
    fireEvent.change(TextInputTest, {target: {value: "test"}});
    expect(screen.getByRole("test")).toBeInTheDocument();
    //expect(screen.getByDisplayValue("test")).toBeInTheDocument();
});

test('simulate DropDown', () => {
    const setValue = jest.fn();
    render(
        <Dropdown values={["test1", "test2"]} setValue={setValue} />
    );
    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
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