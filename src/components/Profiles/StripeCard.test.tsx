import { render } from '@testing-library/react';
import StripeCard from './StripeCard';

test('renders trader profile', () => {
    const onSubmit = jest.fn();

    render(
        <StripeCard onSubmit={onSubmit} />
    );
});