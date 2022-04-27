import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

import { Tag, TagMinimal } from '../types/tagTypes';

interface TagFormProps {
    tagSelect?: Tag,
    updateOrCreateTag: Function,
    deleteTag?: Function
}

const TagForm = (props: TagFormProps): JSX.Element => {

    const { tagSelect, updateOrCreateTag, deleteTag } = props;

    const [ name, setName ] = useState('');

    // initialize
    useEffect(() => {
        if (tagSelect) {
            setName(tagSelect.name);
        }
    }, [ tagSelect ]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const tag: TagMinimal = { name: name };
        
        if (tagSelect) {
            tag.id = tagSelect.id;
        }

        updateOrCreateTag(tag);
        setName('');
    };

    return (
        <Form 
            onSubmit={handleSubmit} 
            style={{ display: 'flex', flexDirection: 'row' }}
        >
            <InputGroup 
                size='sm'
                style={{ 
                    display: 'flex', 
                    flexDirection: 'row',
                    width: 'fit-content'
                }}>
                <Form.Control 
                    placeholder='Add New Tag'
                    style={{ borderRadius: '15px 0px 0px 15px' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Button 
                    type='submit'
                    variant='secondary'
                    style={{ borderRadius: '0px 15px 15px 0px' }}
                >
                    Save
                </Button>
            </InputGroup>

            { deleteTag
                ? <Button 
                    variant='danger'
                    style={{ borderRadius: '20px' }}
                    onClick={e => deleteTag()}
                >X</Button>
                : null
            }
        </Form>
    );
};

export default TagForm;