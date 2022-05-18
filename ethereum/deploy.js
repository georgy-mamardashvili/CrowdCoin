const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
 
provider = new HDWalletProvider(
  'YOUR_MNEMONIC',
  'https://rinkeby.infura.io/v3/bfdb3a15d4274554879781c796b103e0'
);
 
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy contract from account: ' + accounts[0]); 
  const results = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '1400000', from: accounts[0] });
  
  console.log('Contract deployed to: ' + results.options.address);
  provider.engine.stop();
};

try {
  deploy();
} catch(e) {
  console.log('error');
}