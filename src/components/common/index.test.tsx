import React from 'react';
import { useState } from 'react';
import { findByLabelText, fireEvent, queryByDisplayValue, queryByRole, render, screen } from '@testing-library/react';
import { Button } from './index';
import { TextInput } from './index';
import { Dropdown } from './index';
import SearchBar from './SearchBar';
import List from './List';
import { User } from '../../services/index';
import IUser from '../../components/interfaces/IUser';


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

    fireEvent.change(screen.getByRole("search-bar"), {
        target: { value: "test" }
    });

    expect(setValue).toHaveBeenCalled();
});

test('register new user with email not valid', () => {
    const listOfStrings = [
        "ceci",
        "est",
        "un",
        "exemple"
    ];

    const [focusItem, setFocusItem] = useState<string | undefined>(undefined);

    const itemDisplayerFunction = (item: string): JSX.Element => {
        return <p onClick={() => setFocusItem(item)}>{item}</p>;
    };

    const itemUpdaterFunction = (item: string): JSX.Element => {
        return <p>J'ai clické sur : {item}</p>
    };

    render(
        <List
            items={listOfStrings}
            itemDisplayer={itemDisplayerFunction}
            itemUpdater={itemUpdaterFunction}
            focusItem={focusItem}
        />
    );

    expect(screen.getByText("ceci")).toBeInTheDocument();
    expect(screen.getByText("est")).toBeInTheDocument();
    expect(screen.getByText("un")).toBeInTheDocument();
    expect(screen.getByText("exemple")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("ceci")).toBeInTheDocument();
});