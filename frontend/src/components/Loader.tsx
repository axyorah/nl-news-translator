import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ size="70px" }): JSX.Element => {
    return (
        <div className="text-center">
            <Spinner 
                style={{ width: size, height: size }}
                animation="border" 
                variant="light"
            />
        </div>
    );
};

export default Loader;