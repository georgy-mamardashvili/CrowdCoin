import React, { Component } from 'react';
import { Card, Button, Grid, Header } from 'semantic-ui-react';

import Campaign from '../../ethereum/models/campaign';
import web3 from '../../ethereum/web3';

import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContibuteForm';
import { Link } from '../../routes';

class CampaignProfile extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            campaignAddress: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4],
        };
    }

    renderCards() {
        const items = [{
            header: this.props.manager,
            meta: 'Address of Manager', 
            description: 'The manager created this campaign and can create requests to withdraw money',
            style: { overflowWrap: 'break-word' },
        },{
            header: this.props.minimumContribution,
            meta: 'Minimum Contribution (wei)', 
            description: 'You must contribute at least this much wei to become a contibutor',
        },
        {
            header: this.props.requestsCount,
            meta: 'Number of Requests', 
            description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers',
        },
        {
            header: this.props.contributorsCount,
            meta: 'Number of Contributors', 
            description: 'Number of people who have already donated to this campaign',
        },
        {
            header: web3.utils.fromWei(this.props.balance, "ether"),
            meta: 'Campaign Balance (ether)', 
            description: 'The balance is how much money this campaign has left to spend',
        },
    ];

        return <Card.Group items={items}/>
    }

    render() {
        return (
            <Layout>
                <Header
                    as='h2'
                    content='Campaign Profile'
                    subheader={`Address: ${this.props.campaignAddress}`}
                    textAlign='center'
                />
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.campaignAddress}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <a>
                                    <Button primary>View Spending Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    };
}

export default CampaignProfile;