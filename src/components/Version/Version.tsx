import React from 'react';

const Version: React.FC = () => {

    return (
        <p>{process.env.REACT_APP_VERSION}</p>
    );
}

export default Version;