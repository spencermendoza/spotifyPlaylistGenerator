import React, { useContext } from 'react';
import { LibraryContext } from '../../Context/LibraryContext';
import { CreateContext } from '../CreateContext/CreateContext';
import { Checkbox } from '../..';

const ArtistList = () => {
    
    let { list } = useContext(CreateContext);

    return (
        <ul className='list'>
            {list.map((artist, i) => (
                <Checkbox item={artist} key={i} />
            ))}
        </ul>
    )
}

export default ArtistList;