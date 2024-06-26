import { ethers } from "./ethers.js";
import { abi , contractAddress} from "./constants.js";
const connectButton=document.getElementById('connect-btn');
const fundButton=document.getElementById('fund');
const balanceButton=document.getElementById('balance')
const withdrawButton=document.getElementById('withdraw')
connectButton.onclick=connect;
fundButton.onclick=fund;
balanceButton.onclick=getBalance;
withdrawButton.onclick=withdraw;
async function connect (){
  if(typeof window.ethereum!=="undefined"){
     await ethereum.request({method:"eth_requestAccounts"})
     connectButton.innerHTML="Connected"
  }
  else{
    connect.innerHTML="Please install MetaMask!!!"
  }
}

async function getBalance(){
  if(typeof window.ethereum!=="undefined"){
    const provider= new ethers.providers.Web3Provider(window.ethereum);
    const balance=await provider.getBalance(contractAddress);
    document.getElementById("show-balance").innerHTML=`<h1>${ethers.utils.formatEther(balance)} ETH</h1>`;
  }
}

async function fund(){
  const ethAmount=document.getElementById("ethAmount").value;
  if(typeof window.ethereum!=="undefined"){
    //provider or connection to blockchain
    //signer/wallet/someone with gas
    //contract that we are working with
    //^ ABI & Address
    const provider= new ethers.providers.Web3Provider(window.ethereum);
    const signer=provider.getSigner();
    const contract=new ethers.Contract(contractAddress,abi, signer);
    try {
      const transactionResponse=await contract.fund({value: ethers.utils.parseEther(ethAmount)})
      await listenForTransactionMined(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
    
  }
}
function listenForTransactionMined(transactionResponse, provider){
       console.log(`Mining ${transactionResponse.hash}.........`);
       return new Promise((resolve, reject)=>{
        provider.once(transactionResponse.hash,(transactionReceipt)=>{
          console.log(`Completed with ${transactionReceipt.confirmations}`)
          resolve();
       })
       })
      
}

async function withdraw(){
 if(typeof window.ethereum!=="undefined"){
    const provider= new ethers.providers.Web3Provider(window.ethereum);
    const signer=provider.getSigner();
    const contract=new ethers.Contract(contractAddress,abi, signer);
    try {
       const transactionResponse= await contract.withdraw();
       await listenForTransactionMined(transactionResponse, provider)
    } catch (error) {
      console.log(error);
    }

    }

}