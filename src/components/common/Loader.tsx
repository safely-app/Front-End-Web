import React from 'react';
import Loader from 'react-loader-spinner';
import './index.css';

interface ICommonLoaderProps {
    height: number;
    width: number;
    color: string;
}

const CommonLoader: React.FC<ICommonLoaderProps> = ({
    height,
    width,
    color
}) => {
    return (
        <div className='Loader-container'>
            <div className='Loader-main'>
                <Loader type="Oval" color={color} height={height} width={width} />
            </div>
        </div>
    );
};

export default CommonLoader;