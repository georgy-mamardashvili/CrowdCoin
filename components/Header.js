import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from '../routes';

class Header extends Component {
    render() {
        return (
            <Menu>
                <Link route='/'>
                    <a className='item'><strong>CrowdCoin</strong></a>
                </Link>

                <Menu.Menu>
                    <Link route='/campaigns'>
                        <a className='item'>Campaigns</a>
                    </Link>
                    <Link route='/campaigns/new'>
                        <a className='item'>Create New</a>
                    </Link>                  
                </Menu.Menu>
            </Menu>
        );
    };
}

export default Header;