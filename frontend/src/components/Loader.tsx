import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
    size?: string
}

const Loader = ({ size="70px" }: LoaderProps): JSX.Element => {
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