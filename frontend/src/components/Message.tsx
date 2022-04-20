import React from 'react';
import { Alert } from 'react-bootstrap';

interface MessageProps {
    variant: string,
    children: React.ReactNode
}

const Message = (props: MessageProps): JSX.Element => {
    const { variant='danger', children } = props;
    return (
        <Alert variant={variant}>
            { children }
        </Alert>
    );
};

export default Message;