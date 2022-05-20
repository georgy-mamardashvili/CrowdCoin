import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/models/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        approveIsLoading: false,
        finilizeIsLoading: false,
    }

    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({approveIsLoading: true});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0],
            });
        } catch(e) {
            console.log(e.message);
        }
        this.setState({approveIsLoading: false });
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }

    onFinilize = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({finilizeIsLoading: true});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finilizeRequest(this.props.id).send({
                from: accounts[0],
            });
        } catch(e) {
            console.log(e.message);
        }
        this.setState({finilizeIsLoading: false});
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }

    render() {
        const { Row, Cell } = Table;
        const {id, request, contributorsCount } = this.props;
        const readyToFinilize = request.approvalCount > contributorsCount / 2;
        return (
            <Row disabled={request.complete} positive={readyToFinilize && !request.complete}>
                <Cell>{parseInt(id) + 1}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{`${request.approvalCount} / ${contributorsCount}`}</Cell>
                <Cell>
                    { request.complete ? null : (
                        <Button color='green' basic loading={this.state.approveIsLoading} onClick={this.onApprove}>Approve</Button>
                    )}
                </Cell>
                <Cell>
                    { request.complete ? null : (
                        <Button color='teal' disabled={!readyToFinilize} basic loading={this.state.finilizeIsLoading} onClick={this.onFinilize}>Finilize</Button>
                    )}
                </Cell>
            </Row>
        );
    };
}

export default RequestRow;