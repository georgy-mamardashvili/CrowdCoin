import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import 'semantic-ui-css/semantic.min.css'

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
        return (<div>
            {this.renderCampaigns()}
        </div>);
    };
}

export default CampaignList;