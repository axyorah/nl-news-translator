import React from 'react';
import { connect } from 'react-redux';

import Message from '../components/Message';
import UserChecker from '../components/UserChecker';

const ProfileScreen = () => {

    const renderTemporaryInProgressMessage = () => {
        const msg = `
            TODO: basic profile stats visualized: 
            pie chart with tag percentages and timeline of 
            number of notes added per day colorcoded by tags
        `
        return (
            <Message variant='info'>{msg}</Message>
        );
    };
    return (
        <div>
            <h3>My Profile</h3>

            <UserChecker />
            
            { renderTemporaryInProgressMessage() }
        </div>
    );
};

export default connect()(ProfileScreen);