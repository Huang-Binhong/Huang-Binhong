import React from 'react';
import './FlyingBird.css';
import birdSvg from '../assets/bird.svg';

const FlyingBird = () => {
    return (
        <div className="bird-container">
            <div 
                className="bird"
                style={{ backgroundImage: `url(${birdSvg})` }}
            ></div>
        </div>
    );
};

export default FlyingBird;
