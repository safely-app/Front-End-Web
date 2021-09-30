import IStripe from "../components/interfaces/IStripe";
import { Stripe } from './index';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

test('get stripe by id', async () => {
    const scope = nock(baseURL)
        .get('/Stripe/user/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Stripe.get("1", "");
    expect(response.status).toEqual(200);
    scope.done();
});

test('create stripe', async () => {
    const scope = nock(baseURL)
        .post('/Stripe/user')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

        const data: IStripe = {
            id: '1',
            name: 'Bill Cosby',
            address: '8 Avenue du Huit',
            phone: '8888-8888',
            description: 'Aime le huit neuf'
        };

        const response = await Stripe.create(data, "");
        expect(response.status).toEqual(200);
        scope.done();
});

test('update stripe by id', async () => {
    const scopeOptions = nock(baseURL)
        .options('/Stripe/user/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(baseURL)
        .put('/Stripe/user/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const data: IStripe = {
        id: '1',
        name: 'Bill Cosby',
        address: '8 Avenue du Huit',
        phone: '8888-8888',
        description: 'Aime le huit neuf'
    };

    const response = await Stripe.update("1", data, "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scope.done();
});

test('link card to stripe user', async () => {
    const scope = nock(baseURL)
        .post('/Stripe/cardLink')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const data = {
        cardId: "1",
        stripeId: "1"
    };

    const response = await Stripe.linkCard(data, "");
    expect(response.status).toEqual(200);
    scope.done();
});