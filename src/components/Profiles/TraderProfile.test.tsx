import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import TraderProfile from './TraderProfile';

test('renders trader profile', () => {
    render(
        <Provider store={store}>
            <TraderProfile />
        </Provider>
    );
});

test('renders trader profile text fields', () => {
    render(
        <Provider store={store}>
            <TraderProfile />
        </Provider>
    );

    fireEvent.click(screen.getByText("Afficher les informations optionelles"));

    expect(screen.getByRole("companyName")).toBeInTheDocument();
    expect(screen.getByRole("companyAddress")).toBeInTheDocument();
    expect(screen.getByRole("companyAddress2")).toBeInTheDocument();
    expect(screen.getByRole("billingAddress")).toBeInTheDocument();
    expect(screen.getByRole("clientNumberTVA")).toBeInTheDocument();
    expect(screen.getByRole("personalPhone")).toBeInTheDocument();
    expect(screen.getByRole("companyPhone")).toBeInTheDocument();
    expect(screen.getByRole("RCS")).toBeInTheDocument();
    expect(screen.getByRole("registrationCity")).toBeInTheDocument();
    expect(screen.getByRole("SIREN")).toBeInTheDocument();
    expect(screen.getByRole("SIRET")).toBeInTheDocument();
    expect(screen.getByRole("artisanNumber")).toBeInTheDocument();
    expect(screen.getByRole("type")).toBeInTheDocument();
});