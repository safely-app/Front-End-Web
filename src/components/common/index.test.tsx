import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Button,
    CreateButton,
    TextInput,
    Dropdown,
    SearchBar,
    NavBar,
} from './index';

test('simulate click', () => {
    const onClick = jest.fn();

    render(
        <Button text="click" onClick={onClick} />
    );

    fireEvent.click(screen.getByText("click"));
    expect(onClick).toHaveBeenCalled();
});

test('simulate CreateButton click', () => {
    const onClick = jest.fn();

    render(
        <CreateButton text="click" onClick={onClick} />
    );

    fireEvent.click(screen.getByText("click"));
    expect(onClick).toHaveBeenCalled();
});
  
test('simulate mouse over', () => {
    const onMouseOver = jest.fn();

    render(
        <Button text="click" onClick={jest.fn()} onMouseOver={onMouseOver} />
    );

    fireEvent.mouseOver(screen.getByText("click"));
    expect(onMouseOver).toHaveBeenCalled();
});

test('simulate mouse out', () => {
    const onMouseOut = jest.fn();

    render(
        <Button text="click" onClick={jest.fn()} onMouseOut={onMouseOut} />
    );

    fireEvent.mouseOut(screen.getByText("click"));
    expect(onMouseOut).toHaveBeenCalled();
});

test('simulate TextInput', () => {
    const setValue = jest.fn();
    render(
        <TextInput type="test" role="test" value="" setValue={setValue} label="test" />
    );
    const TextInputTest = screen.getByRole("test")
    fireEvent.change(TextInputTest, { target: { value: "test" } });
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

    fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "test" }
    });

    expect(setValue).toHaveBeenCalled();
});

test('test navbar', () => {
    const firstFn = jest.fn();
    const secondFn = jest.fn();

    render(
        <NavBar elements={[
            { text: '1', onClick: firstFn },
            { text: '2', onClick: secondFn }
        ]} />
    );

    const firstButton = screen.getByTestId('1-navbar-button-id');
    const secondButton = screen.getByTestId('2-navbar-button-id');
    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();

    fireEvent.click(firstButton);
    fireEvent.click(secondButton);

    expect(firstFn).toHaveBeenCalled();
    expect(secondFn).toHaveBeenCalled();
});
