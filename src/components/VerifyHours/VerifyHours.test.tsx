import { act, render } from '@testing-library/react';
import VerifyHours from './VerifyHours';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render verifyhours', async () => {
    const scope = nock(testURL)
        .get('/safeplace/safeplace/getHours/undefined')
        .reply(200, { dayTimetable: [
            "8h à 12h, 14h à 18h",
            "8h à 12h, 14h à 18h",
            "8h à 12h, 14h à 18h",
            "8h à 12h, 14h à 18h",
            "8h à 12h, 14h à 18h",
            "",
            ""
        ] }, { 'Access-Control-Allow-Origin': '*' });

    render(
        <VerifyHours />
    );

    await act(async () => await testDelay(1000));
    scope.done();
});