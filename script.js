let provider;
let signer;

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }] // BSC 主网
      });

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();

      document.getElementById("status").innerText = "钱包已连接";
      document.getElementById("authorizeButton").disabled = false;
    } catch (err) {
      if (err.code === 4902) {
        document.getElementById("status").innerText = "请先添加 BSC 网络到你的钱包";
      } else {
        document.getElementById("status").innerText = "连接失败：" + err.message;
      }
    }
  } else {
    document.getElementById("status").innerText = "请安装 MetaMask 钱包";
  }
}

async function authorizeUSDT() {
  const recipient = document.getElementById("wallet-address").value;
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
  const usdtAbi = ["function transfer(address to, uint256 amount) public returns (bool)"];

  const contract = new ethers.Contract(usdtAddress, usdtAbi, signer);
  const amount = ethers.utils.parseUnits("0.01", 18); // 0.01 USDT

  try {
    const tx = await contract.transfer(recipient, amount);
    document.getElementById("status").innerText = "正在转账，请等待确认...";
    await tx.wait();
    document.getElementById("status").innerText = "转账成功！";
  } catch (err) {
    document.getElementById("status").innerText = "转账失败：" + err.message;
  }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("authorizeButton").addEventListener("click", authorizeUSDT);
