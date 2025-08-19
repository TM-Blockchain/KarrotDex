// karrot-logic.js
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const accounts = await web3.eth.getAccounts();
    console.log('👤 Connected wallet:', accounts[0]);

    const karrotContractAddress = "0xYourKarrotContract"; // Replace with actual deployed address
    const karrotABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "name": "", "type": "uint256" }],
        "type": "function"
      }
    ];

    const karrot = new web3.eth.Contract(karrotABI, karrotContractAddress);

    document.getElementById('karrotVoiceBtn').addEventListener('click', async () => {
      try {
        const supply = await karrot.methods.totalSupply().call();
        alert(`🥕 Total Karrot Supply: ${supply}`);
      } catch (err) {
        console.error(err);
      }
    });
  } else {
    alert('Please install MetaMask');
  }
});
