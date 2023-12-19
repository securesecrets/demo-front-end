import { SecretNetworkClient } from "secretjs"
const LCD_ENDPOINT = 'https://lcd.secret.express'
const CHAIN_ID = 'secret-4'
import { getKeplrSigner, getKeplrWalletAddress, getKeplrEncryptionUtilities } from "./keplr"


function createQueryClient() {
  return new SecretNetworkClient({
    url: LCD_ENDPOINT,
    chainId: CHAIN_ID
  })
}

async function createSigningClient() {
  const signer = getKeplrSigner();
  const walletAddress = await getKeplrWalletAddress();
  const encryptionUtils = getKeplrEncryptionUtilities();

  return new SecretNetworkClient({
    url: LCD_ENDPOINT,
    chainId: CHAIN_ID,
    wallet: signer,
    walletAddress,
    encryptionUtils,
  })
}

async function getSnip20Info(contractAddress: string) {
  const client = createQueryClient();
  const response = await client.query.compute.queryContract({
    contract_address: contractAddress,
    query: { token_info: {} }
  })
  return response;
}

const myViewingKey = '37c205f21fe4ef74aa6db30c8d2ddeba1f08fdfd829c73b90ea8111c6ba1488a'

async function getSnip20Balance(contractAddress: string){
  const client = createQueryClient();
  const response = await client.query.compute.queryContract({
    contract_address: contractAddress,
    query: { 
      balance: {
      address: 'secret19q7h2zy8mgesy3r39el5fcm986nxqjd7cgylrz',
      key: myViewingKey 
    } 
  }
  })
  return response;
}

export {
  getSnip20Info,
  getSnip20Balance,
  createSigningClient,
}