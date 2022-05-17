import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x09d592c7Fa4F8FF0Ac17B1cB92cfC106FBD8913C',
);

export default instance;