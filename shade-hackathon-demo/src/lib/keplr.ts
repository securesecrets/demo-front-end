import type { Sign } from "crypto";
import type { Signer } from "secretjs/dist/wallet_amino";

const CHAIN_ID = 'secret-4'

function getKeplr() {
  return window.keplr
}


function enableKeplr() {
  const keplr = getKeplr();
  keplr?.enable(CHAIN_ID)
}

function getKeplrSigner() {
  const keplr = getKeplr();
  return keplr?.getOfflineSignerOnlyAmino(CHAIN_ID) as Signer
}

async function getKeplrWalletAddress() {
  const keplr = getKeplr();
  const offlineSigner = keplr?.getOfflineSignerOnlyAmino(CHAIN_ID)!
  const account = await offlineSigner.getAccounts();
  return account[0].address;
}

function getKeplrEncryptionUtilities() {
  const keplr = getKeplr();
  return keplr?.getEnigmaUtils(CHAIN_ID)
}

export {
  enableKeplr,
  getKeplrSigner,
  getKeplrWalletAddress,
  getKeplrEncryptionUtilities,
}