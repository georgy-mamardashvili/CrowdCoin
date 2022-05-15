const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
 
let accounts = [];
let factory;
let campaignAddress;
let campaign;

const MIN_CONTRIBUTION = 100;
 
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    admin = accounts[0];

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({
            data: compiledFactory.evm.bytecode.object,
        })
        .send({ from: admin, gas: '1200000' });
    await factory.methods.createCompaign(MIN_CONTRIBUTION).send({
        from: admin,
        gas: '1000000',
    });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as a campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(admin, manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: MIN_CONTRIBUTION + 1,
            from: accounts[1],
        });
        let isContributor = await campaign.methods.contributors(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: MIN_CONTRIBUTION - 1,
                from: accounts[1],
            });
            assert(false);
        } catch(e) {
            assert(e);
        }
    });

    it('allows a manager to make a payment request', async () => {
        const SAMPLE_DESCR = 'Buy batteries';
        await campaign.methods
            .createRequest(SAMPLE_DESCR, '100', accounts[2])
            .send({
                from: admin,
                gas: '1000000',
            });
        const request = await campaign.methods.requests(0).call();

        assert.equal(SAMPLE_DESCR, request.description);
    });

    it('processes request', async () => {
        const contributorAddress = accounts[1];
        const targetAddress = accounts[2];

        const requestAmount = 5;
        const delta = 0.1;

        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: contributorAddress
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei(requestAmount.toString(), 'ether'), targetAddress)
            .send({
                from: admin,
                gas: '1000000',
            });

        const requestBefore = await campaign.methods.requests(0).call();
        assert.equal(0, requestBefore.approvalCount);

        await campaign.methods.approveRequest(0).send({
            from: contributorAddress,
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();
        assert.equal(1, request.approvalCount);

        let balanceBefore = await web3.eth.getBalance(targetAddress);
        balanceBefore = web3.utils.fromWei(balanceBefore, 'ether');
        balanceBefore = parseFloat(balanceBefore);

        await campaign.methods.finilizeRequest(0).send({
            from: admin,
            gas: '1000000',
        });

        let balanceAfter = await web3.eth.getBalance(targetAddress);
        balanceAfter = web3.utils.fromWei(balanceAfter, 'ether');
        balanceAfter = parseFloat(balanceAfter);

        assert(balanceAfter - balanceBefore > (requestAmount - delta))
    });
});