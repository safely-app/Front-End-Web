import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import {
    notifyError,
    notifySuccess,
    convertStringToRegex
} from './utils';
import {
    getErrorMsgByErrorName,
    getErrorMsgByStatusCode
} from './errorMessages';
import { AxiosResponse } from 'axios';
import { getTimetableFromSafeplace, updateSafeplaceWithTimetable } from './timetableUtils';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('ensure that notifyError occurs without errors', async () => {
    render(
        <div>
            <button onClick={() => notifyError('test')}>
                Test button
            </button>
            <ToastContainer />
        </div>
    );

    const testButton = screen.getByText('Test button');

    expect(testButton).toBeInTheDocument();
    fireEvent.click(testButton);

    await act(async () => await testDelay(1000));

    expect(screen.getByText('test')).toBeInTheDocument();
});

test('ensure that notifySuccess occurs without errors', async () => {
    render(
        <div>
            <button onClick={() => notifySuccess('test')}>
                Test button
            </button>
            <ToastContainer />
        </div>
    );

    const testButton = screen.getByText('Test button');

    expect(testButton).toBeInTheDocument();
    fireEvent.click(testButton);

    await act(async () => await testDelay(1000));

    expect(screen.getByText('test')).toBeInTheDocument();
});

test('ensure that convertStringToRegex occurs without errors', () => {
    const value = '/api)eai[|uj\\p(';
    const result = convertStringToRegex(value);

    expect(result).toEqual(RegExp('\\/api\\)eai\\[\\|uj\\\\p\\('));
});

test('test getErrorMsgByStatusCode', () => {
    const response: AxiosResponse = {
        data: {},
        status: 0,
        statusText: "",
        headers: {},
        config: {}
    };

    expect(getErrorMsgByStatusCode({
        ...response,
        status: 401
    })).toEqual("Veuillez vous authentifier avant de continuer.");

    expect(getErrorMsgByStatusCode({
        ...response,
        status: 403
    })).toEqual("Accès non-autorisé : veuillez vérifiez que vous avez accès à cette ressource.");

    expect(getErrorMsgByStatusCode({
        ...response,
        status: 404
    })).toEqual("Ressource introuvable.");

    expect(getErrorMsgByStatusCode({
        ...response,
        status: 0
    })).toEqual("0  : Une erreur s'est produite. Si cela persiste, veuillez nous contacter.");
});

test('test getErrorMsgByErrorName', () => {
    const error: Error = {
        name: "",
        message: ""
    };

    expect(getErrorMsgByErrorName({
        ...error,
        message: "Network Error"
    })).toEqual("Erreur de réseau : service injoignable. Si cela persiste, veuillez nous contacter.");

    expect(getErrorMsgByErrorName({
        ...error
    })).toEqual(" : Une erreur s'est produite. Si cela persiste, veuillez nous contacter.");
});

test("test getTimetableFromSafeplace", () => {
    const day = {
        name: "",
        isChecked: true,
        timetable: [
            "08:00",
            "09:00",
            "12:00",
            "13:00"
        ]
    };

    expect(getTimetableFromSafeplace({
        id: "1",
        name: "test",
        city: "test",
        type: "test",
        address: "test",
        description: "test",
        dayTimetable: [
            "8h00 à 9h00,12h00 à 13h00",
            "8h00 à 9h00,12h00 à 13h00",
            "8h00 à 9h00,12h00 à 13h00",
            "8h00 à 9h00,12h00 à 13h00",
            "8h00 à 9h00,12h00 à 13h00",
            "8h00 à 9h00,12h00 à 13h00",
            "8h00 à 9h00,12h00 à 13h00"
        ],
        coordinate: [ "", "" ],
        ownerId: ""
    })).toEqual([
        { ...day, name: "Lundi" },
        { ...day, name: "Mardi" },
        { ...day, name: "Mercredi" },
        { ...day, name: "Jeudi" },
        { ...day, name: "Vendredi" },
        { ...day, name: "Samedi" },
        { ...day, name: "Dimanche" }
    ]);
});

test("test updateSafeplaceWithTimetable", () => {
    const day = {
        name: "",
        isChecked: true,
        timetable: [
            "08:00",
            "09:00",
            "12:00",
            "13:00"
        ]
    };

    const safeplace = {
        id: "1",
        name: "test",
        city: "test",
        type: "test",
        address: "test",
        description: "test",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "", "" ],
        ownerId: ""
    };

    expect(updateSafeplaceWithTimetable(safeplace, [
        { ...day, name: "Lundi" },
        { ...day, name: "Mardi" },
        { ...day, name: "Mercredi" },
        { ...day, name: "Jeudi" },
        { ...day, name: "Vendredi" },
        { ...day, name: "Samedi" },
        { ...day, name: "Dimanche" }
    ])).toEqual({
        ...safeplace,
        dayTimetable: [
            "08h00 à 09h00,12h00 à 13h00",
            "08h00 à 09h00,12h00 à 13h00",
            "08h00 à 09h00,12h00 à 13h00",
            "08h00 à 09h00,12h00 à 13h00",
            "08h00 à 09h00,12h00 à 13h00",
            "08h00 à 09h00,12h00 à 13h00",
            "08h00 à 09h00,12h00 à 13h00"
        ]
    });
});