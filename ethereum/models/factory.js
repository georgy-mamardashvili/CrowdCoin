import web3 from '../web3';
import CampaignFactory from '../build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x834d2d0a9903Cbbfd53F5D3476Ea64D178617919',
);

export default instance;