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
        <Form style={{ display: 'flex', flexDirection: 'row' }} >
            <InputGroup >
                <Form.Control 
                    placeholder='Add New Tag'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Button 
                    type='button'
                    variant='secondary'
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </InputGroup>

            { deleteTag
                ? <Button
                    type='button' 
                    className='ms-4'
                    variant='danger'
                    onClick={e => deleteTag()}
                >X</Button>
                : null
            }
        </Form>
    );
};

export default TagForm;