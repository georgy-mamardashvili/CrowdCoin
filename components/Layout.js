import React, { Component } from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';

class Layout extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    };
}

export default Layout;