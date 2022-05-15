import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x764926Ea8734320269792c816f4aeE1d5d4e7da4',
);

export default instance;