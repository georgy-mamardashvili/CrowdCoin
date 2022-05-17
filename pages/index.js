import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Router } from '../routes';

class Index extends Component {
    onClick = async (event) => {
        event.preventDefault();
        Router.pushRoute('/campaigns');
    }

    render() {
        return (
            <Layout>
                <div
                    onClick={this.onClick} 
                    style={{textAlign: 'center'}}>
                    Let's begin!
                </div>
            </Layout>
        );
    };
}

export default Index;