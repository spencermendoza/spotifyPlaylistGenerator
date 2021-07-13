import React,  { useContext, } from 'react';
import { CreateContext } from '../CreateContext/CreateContext';
import { Checkbox } from '../..';


const GenreList = () => {

    let { list } = useContext(CreateContext);

    return (
        <ul className='list'>
            {list.map((genre, i) => (
                <Checkbox item={genre} key={i} />
            ))}
        </ul>
    );
}

export default GenreList;