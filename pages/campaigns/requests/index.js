import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/models/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestList extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const summary = await campaign.methods.getSummary().call();
        const contributorsCount = summary[3];

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        return { address, requests, requestCount, contributorsCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                request={request}
                key={index}
                id={index}
                address={this.props.address}
                contributorsCount={this.props.contributorsCount}
                />
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Spending Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated='right' style={{marginBottom: 10}}>Add request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finilize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        { this.renderRows() }
                    </Body>
                </Table>
                <div> Found {this.props.requestCount} requests</div>
            </Layout>
        );
    };
}

export default RequestList;