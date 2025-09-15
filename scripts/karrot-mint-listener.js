const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();

// ====== ENVIRONMENT SETUP ======
const web3 = new Web3(process.env.RPC_URL); // PulseChain RPC
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log(`🧠 Listening as ${account.address}`);

// ====== CONTRACT ADDRESSES ======
const escrowAddress = process.env.ESCROW_ADDRESS;
const minterAddress = process.env.MINTER_ADDRESS;

// ====== LOAD ABIs ======
const escrowAbi = JSON.parse(fs.readFileSync('./abi/KarrotEscrow.json'));
const minterAbi = JSON.parse(fs.readFileSync('./abi/pxAssetMinter.json'));

const escrow = new web3.eth.Contract(escrowAbi, escrowAddress);
const minter = new web3.eth.Contract(minterAbi, minterAddress);

// ====== LISTEN FOR LOCK EVENTS ======
escrow.events.AssetLocked({ fromBlock: 'latest' })
.on('data', async (event) => {
    const { user, assetSymbol, amount, proofHash } = event.returnValues;

    console.log(`🔒 Lock detected: ${amount} ${assetSymbol} from ${user}`);

    try {
        // Simulated lockProof (in production: pull from bridge or ZK oracle)
        const dummyProof = web3.utils.randomHex(32); // placeholder hash

        // Submit mint request
        const tx = await minter.methods.mintFromLockProof(
            assetSymbol,
            user,
            amount,
            dummyProof
        ).send({ from: account.address, gas: 300000 });

        console.log(`✅ Minted ${amount} px${assetSymbol} to ${user}`);
    } catch (error) {
        console.error(`❌ Mint failed:`, error.message);
    }
})
.on('error', console.error);
