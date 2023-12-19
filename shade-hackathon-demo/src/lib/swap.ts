import { MsgExecuteContract } from "secretjs"
import { batchQueryPairsInfo } from "@shadeprotocol/shadejs";
import type { Contract } from "@shadeprotocol/shadejs";
import { createSigningClient } from "./client";


/**
* Generates random string of characters, used to add entropy to TX data
* */
const randomPadding = ():string => {
  enum length {
    MAX = 15,
    MIN = 8
  }
  const paddingLength = Math.floor(Math.random() * (length.MAX - length.MIN + 1)) + length.MIN;
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < paddingLength; i += 1) {
    result += characters.charAt(Math.floor(Math.random()
      * characters.length));
  }
  return result;
};

function msgSnip20Send({
  recipient,
  recipientCodeHash,
  amount,
  handleMsg,
  padding,
}: {
  recipient: string,
  recipientCodeHash?: string,
  amount: string,
  handleMsg: any,
  padding: string,
}){
  return {
    send: {
      recipient,
      recipient_code_hash: recipientCodeHash,
      amount,
      msg: 'MOCK_BASE_64',
      padding,
    },
  };
}

enum SwapType {
  STABLE = 'stable',
  DERIVATIVE = 'derivative',
  CONSTANT_PRODUCT = 'constant_product'
}
type Path = {
  poolContractAddress: string,
  poolCodeHash: string,
  poolType: SwapType,
}

type Paths = Path[]

type PathContractFormatted = {
  addr: string,
  code_hash: string,
}

type PathsContractFormatted = PathContractFormatted[]

function createMsgSwap({
  sourceAddress,
  snip20ContractAddress,
  snip20CodeHash,
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  path,
}: {
  sourceAddress: string,
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  path: Paths,
}) {
  const pathFormatted: PathsContractFormatted = path.map((hop: Path) => ({
    addr: hop.poolContractAddress,
    code_hash: hop.poolCodeHash,
  }));

  const swapParamsMessage = {
    swap_tokens_for_exact: {
      expected_return: minExpectedReturnAmount,
      path: pathFormatted,
    },
  };

  const msg = msgSnip20Send({
    recipient: routerContractAddress,
    recipientCodeHash: routerCodeHash,
    amount: sendAmount,
    handleMsg: swapParamsMessage,
    padding: randomPadding(),
  });

  return new MsgExecuteContract({
    sender: sourceAddress,
    contract_address: snip20ContractAddress,
    msg,
    code_hash: snip20CodeHash,
  })
}

async function sendSwapTransaction({
  sourceAddress,
  snip20ContractAddress,
  snip20CodeHash,
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  path,
  gasCost,
}:{
  sourceAddress: string,
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  path: Paths,
  gasCost: number,
}) {
  const msg = createMsgSwap({
    sourceAddress,
    snip20ContractAddress,
    snip20CodeHash,
    routerContractAddress,
    routerCodeHash,
    sendAmount,
    minExpectedReturnAmount,
    path,
  });

  const client = await createSigningClient();
  client.tx.broadcast([msg], {
    gasLimit: gasCost,
    gasPriceInFeeDenom: 0.25,
  })
}




async function getPairsInfo(contracts: Contract[]) {
 const info = await batchQueryPairsInfo({
    queryRouterContractAddress: 'secret1pjhdug87nxzv0esxasmeyfsucaj98pw4334wyc',
    pairsContracts: contracts,
  })
  return info;
}

export {
  getPairsInfo,
  sendSwapTransaction,
}