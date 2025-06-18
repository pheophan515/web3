import { useState } from 'react';
import { ethers } from 'ethers';

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [network, setNetwork] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    const newProvider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await newProvider.send("eth_requestAccounts", []);
    const newSigner = await newProvider.getSigner();
    const address = await newSigner.getAddress();
    const networkInfo = await newProvider.getNetwork();
    const balanceWei = await newProvider.getBalance(address);
    const eth = ethers.formatEther(balanceWei);

    setProvider(newProvider);
    setSigner(newSigner);
    setWalletAddress(address);
    setBalance(eth);
    setNetwork(networkInfo.name);
  };

  const sendETH = async () => {
    if (!signer || !sendTo || !amount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setTxStatus("⏳ Sending...");
      const tx = await signer.sendTransaction({
        to: sendTo,
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      setTxStatus("✅ Transaction sent successfully!");
      setAmount('');
      setSendTo('');
    } catch (error) {
      console.error(error);
      setTxStatus("❌ Transaction failed");
    }
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: '40px auto',
      padding: 30,
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f7f9fc',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🦊 Web3 Wallet Dashboard</h1>

      {!walletAddress ? (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={connectWallet} style={{
            padding: '10px 20px',
            backgroundColor: '#ff8c00',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <div style={{ marginBottom: 20 }}>
            <p><strong>📬 Address:</strong><br /> {walletAddress}</p>
            <p><strong>💰 Balance:</strong> {balance} ETH</p>
            <p><strong>🌐 Network:</strong> {network}</p>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <div>
            <h3 style={{ marginBottom: 10 }}>🚀 Send ETH</h3>
            <input
              type="text"
              placeholder="Recipient address"
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
            <button onClick={sendETH} style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Send ETH
            </button>

            {txStatus && (
              <p style={{
                marginTop: 12,
                padding: '8px',
                backgroundColor: '#fffbe6',
                borderLeft: '4px solid #ffd700',
                fontStyle: 'italic'
              }}>
                {txStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
