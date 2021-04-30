import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Authentication from './Authentication';

test('renders authentication sign up component', () => {
    render(<Authentication />);
    expect(screen.getByText(/Déjà inscrit/i)).toBeInTheDocument();
    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getAllByRole("password").length).toEqual(2);
});

test('renders authentication sign in component', () => {
    render(<Authentication />);

    const switchViewButton = screen.getByText(/Déjà inscrit/i);
    expect(switchViewButton).toBeInTheDocument();

    fireEvent.click(switchViewButton);

    expect(screen.getByText(/Pas encore inscrit/i)).toBeInTheDocument();
    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("password")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(2);
})
