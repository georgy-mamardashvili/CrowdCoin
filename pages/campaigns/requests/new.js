import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/models/campaign';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';

class NewRequest extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        errorMessage: '',
        loading: false,
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);

        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(
                    this.state.description,
                    web3.utils.toWei(this.state.value.toString(), 'ether'),
                    this.state.recipient,
                )
                .send({
                    from: accounts[0],
                });
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch(e) {
            this.setState({errorMessage: e.message});
        }
        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h3>Create a Spending Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={ event =>
                                this.setState({description: event.target.value})
                            }
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value</label>
                        <Input
                            label='wei'
                            labelPosition='right'
                            type='number'
                            value={this.state.value}
                            onChange={event =>
                                this.setState({value: event.target.value})
                            }
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            label='address'
                            labelPosition='right'
                            value={this.state.recipient}
                            onChange={event =>
                                this.setState({recipient: event.target.value})
                            }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} primary>Create</Button>
                </Form>
            </Layout>
        );
    };
}

export default NewRequest;