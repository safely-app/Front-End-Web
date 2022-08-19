import { render } from '@testing-library/react';
import { store } from '../../redux';
import { Provider } from 'react-redux';
import CommercialPage from './CommercialPage';

test('render CommercialPage', async () => {
    render(
        <Provider store={store}>
            <CommercialPage />
        </Provider>
    );
});
