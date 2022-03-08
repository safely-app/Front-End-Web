import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import {
    notifyError,
    notifySuccess,
    convertStringToRegex
} from './utils';

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