import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, RootState } from '../../redux';
import { AppHeader } from '../Header/Header';
import './App.css';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const userCredientials = useSelector((state: RootState) => state.user.credentials);

    useEffect(() => {
        dispatch(getUserInfo(userCredientials._id, userCredientials.token));
    });

    return (
        <div className="App">
            <AppHeader />
        </div>
    );
}

export default App;
