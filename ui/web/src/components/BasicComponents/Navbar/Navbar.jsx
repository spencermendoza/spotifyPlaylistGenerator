import React, { useContext } from 'react';
import { LibraryContext } from '../../Context/LibraryContext';
import { GetLogin } from '../../';
import logo from '../../../img/Spotify_Logo_RGB_Black.png';

const Navbar = ({ loggedIn, changeLogin, spotifyURL }) => {

    const { displayOptions, setContextState } = useContext(LibraryContext)

    const changeOption = (value) => {
        setContextState('display', value);
    }

    const show = () => {
        if (loggedIn) {
            return (
                <div className='navbar'>
                    <div className='logoDiv'>
                        <img src={logo} alt='logo' className='logo'></img>
                    </div>
                    <ul className='menu'>
                        {displayOptions.map((item, i) => (
                            <li id='menuItem' key={i} onClick={() => {changeOption(item)}}>{item}</li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return (
                <div className='navbar'>
                    <div className='logoDiv'>
                        <img src={logo} alt='logo' className='logo'></img>
                    </div>
                    <GetLogin changeLogin={changeLogin} spotifyURL={spotifyURL}/>
                </div>
            )
        }
    }
return show();
}

export default Navbar;