import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import {
    InfoSearcher,
    PaymentSolutionList,
    TraderProfile,
    TraderProfileShopList,
    UserProfile
} from './Profile';
import Router from '../../Router';

test('renders UserProfile', () => {
    const user = {
        id: "1",
        username: "test",
        email: "test",
        role: "test"
    };

    render(
        <UserProfile
            user={user}
            setUser={() => {}}
            isUpdateView={false}
        />
    );
});

test('renders TraderProfile', () => {
    const professional = {
        id: "1",
        type: "test",
        userId: "1",
        companyName: "test",
        companyAddress: "test",
        companyAddress2: "test",
        billingAddress: "test test",
        clientNumberTVA: "1234567890123",
        personalPhone: "0688111111",
        companyPhone: "0388111111",
    };

    render(
        <Provider store={store}>
            <TraderProfile
                isUpdateView={false}
                professional={professional}
                searcherState={InfoSearcher.FOUND}
                setProfessional={() => {}}
                setSearcherState={() => {}}
            />
        </Provider>
    );
});

test('renders PaymentSolutionList', () => {
    render(
        <PaymentSolutionList paymentSolutions={[
            {
                id: "1",
                customerId: "1",
                brand: "MASTERCARD",
                country: "FR",
                expMonth: 3,
                expYear: 2023,
                last4: "1234",
                created: "maintenant",
            }
        ]} />
    );
});

test('renders TraderProfileShopList', () => {
    const shops = [
        {
            id: "1",
            name: "test",
            city: "test",
            type: "test",
            address: "test",
            coordinate: [ "", "" ],
            dayTimetable: [ null, null, null, null, null, null, null ]
        }
    ];

    const routes = [
        {
            path: "/",
            exact: false,
            protected: false,
            render: <TraderProfileShopList shops={shops} />
        }
    ];

    render(
        <Provider store={store}>
            <Router routes={routes} />
        </Provider>
    );
});