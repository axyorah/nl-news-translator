import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = (): JSX.Element => {
    return (
        <div className="text-center">
            <Spinner 
                style={{ width: "70px", height: "70px" }}
                animation="border" 
                variant="light"
            />
        </div>
    );
};

export default Loader;