import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

class CampaignList extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map((address) => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true, 
            };
        });
        return <Card.Group items={items}></Card.Group>
    }
    
    render() {
        return (
            <Layout>
                <h3 style={{textAlign: 'center'}}>Open Campaigns:</h3>
                <Link route='/campaigns/new'>
                    <a>
                        <Button
                            floated='right'
                            content='Create Campaign'
                            icon='add'
                            primary/>
                    </a>
                </Link>
                {this.renderCampaigns()}
            </Layout>
        );
    };
}

export default CampaignList;