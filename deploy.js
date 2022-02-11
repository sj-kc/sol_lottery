require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  process.env.KEY,
  'https://rinkeby.infura.io/v3/239fa9759fdc4514acb717d3476b7c7c'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const contract = await new web3.eth.Contract(JSON.parse(interface));
  const deployData = await contract.deploy({
    data: bytecode,
  });

  const inbox = await deployData.send({ from: accounts[0], gas: 4612388 });

  console.log('Deployed to', inbox.options.address);
  console.log('interface', interface);

  provider.engine.stop();
};

deploy();
