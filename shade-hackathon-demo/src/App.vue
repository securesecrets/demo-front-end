<script setup lang="ts">
import { ref } from 'vue';
import { getScrtSupply } from './lib/nodeQuery'
import { getSnip20Info, getSnip20Balance, createSigningClient } from './lib/client'
import { querySnip20TokenInfo, queryFactoryPairs } from '@shadeprotocol/shadejs'
import type { FactoryPairs } from '@shadeprotocol/shadejs'
import { enableKeplr } from './lib/keplr'
import { getPairsInfo, sendSwapTransaction } from './lib/swap'
import { getKeplrWalletAddress } from './lib/keplr'

const scrtSupply = ref('')
const shdInfo = ref()
const shdInfoFromShadeJS = ref()
const shdBalance = ref()
const signingClient = ref({})
const factoryRegisteredPairs = ref({}) 
const pairsInfo = ref({}) 

async function clickMe() {
  scrtSupply.value = await getScrtSupply();
}

async function getShdInfo() {
  shdInfo.value = await getSnip20Info('secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm')
}

async function getShdInfoV2() {
  shdInfoFromShadeJS.value = await querySnip20TokenInfo({
    snip20ContractAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
  })
}

async function getShdBalance() {
  shdBalance.value = await getSnip20Balance('secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm')
}

async function getSigningClient() {
   const value = await createSigningClient()
   signingClient.value = JSON.stringify(value)
}

async function getFactoryRegisteredPairs() {
   const response = await queryFactoryPairs({
    contractAddress: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
    startingIndex: 0,
    limit: 50,
   });

   factoryRegisteredPairs.value = response;
}



enum SwapType {
  STABLE = 'stable',
  DERIVATIVE = 'derivative',
  CONSTANT_PRODUCT = 'constant_product'
}


async function sendSwap() {
  const walletAddress = await getKeplrWalletAddress()

  const response = await sendSwapTransaction({
  sourceAddress: walletAddress,
  snip20ContractAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
  routerContractAddress: 'secret1pjhdug87nxzv0esxasmeyfsucaj98pw4334wyc',
  sendAmount: '100000000',
  minExpectedReturnAmount: '1',
  path: [{
    poolContractAddress: 'secret1l34fyc9g23fnlk896693nw57phevnyha7pt6gj',
    poolCodeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
    poolType: SwapType.CONSTANT_PRODUCT,
  }],
  gasCost: 2000000,
});
}


async function getPairs() {

   const factoryPairs =  factoryRegisteredPairs.value as FactoryPairs;
   const contracts = factoryPairs.pairs.map((pair)=> ({
    address: pair.pairContract.address,
    codeHash: pair.pairContract.codeHash,
}))

   const response = await getPairsInfo(contracts);
   pairsInfo.value = response;
}

</script>


<template>
  <main>
    <div class="wrapper">
    <button @click="clickMe">
      Click Me
    </button>
    {{  scrtSupply }}
    <button @click="getShdInfo">
      Get Token Info
    </button>
    {{  shdInfo }}
    <button @click="getShdInfoV2">
      Get Token Info Using ShadeJS
    </button>
    {{  shdInfoFromShadeJS }}
    <button @click="getShdBalance">
      Get User Balance
    </button>
    {{  shdBalance }}
    <button @click="enableKeplr">
      Enable Keplr
    </button>
    <button @click="getSigningClient">
     Get Signing Client
    </button>
    {{ signingClient }}
    <button @click="getFactoryRegisteredPairs">
     Get Factory Registered Pairs
    </button>
    {{ factoryRegisteredPairs }}
    <button @click="sendSwap">
     Send Swap
    </button>
   </div>
  </main>
</template>
<style>
.wrapper{
  width: 500px;
  display: flex;
  flex-direction: column;
}
</style>