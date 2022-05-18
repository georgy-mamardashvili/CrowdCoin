import web3 from '../web3';
import CampaignFactory from '../build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xe0D8d1c19E78EE985B5953694a2b1cbBf9d4a000',
);

export default instance;