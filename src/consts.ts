import { EthChainId } from "@sentio/sdk/eth";

export const CONFIG = {
  BLOCKCHAIN: EthChainId.ETHEREUM,
};

export const MISC_CONSTS = {
  ONE_E18: BigInt("1000000000000000000"),
  ONE_DAY_IN_MINUTE: 60 * 24,
  ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
  MULTICALL_BATCH: 256,
  RSETH_POINT_RATE: BigInt("1003580000000000000"),
};

export const PENDLE_POOL_ADDRESSES = {
  // retrieved from Pendle pool contract readTokens()
  SY: "0x34349c5569e7b846c3558961552d2202760a9789",
  // retrieved from Pendle pool contract readTokens()
  YT: "0x36bc05a1072ef7d763D5f11f463915aA1efb8Ca8",
  // using new pool contract
  LP: "0x99184849E35D91Dd85f50993bBb03A42Fc0A6FE7",
  // the block which the new contract is deployed
  SY_START_BLOCK: 19516901,
  START_BLOCK: 20158639,
  TREASURY: "0x8270400d528c34e1596ef367eedec99080a1b592",
  EQB_STAKING: "0x68404945A6038fe38452e9594E8AF2F4f6591D93",
  PENPIE_RECEIPT_TOKEN: "0x53777aDc5139f4230aEf6Da4b4E78A4faD4BB8c7",
  // STAKEDAO_RECEIPT_TOKEN: "0xdd9df6a77b4a4a07875f55ce5cb6b933e52cb30a",
  MULTICALL: "0xca11bde05977b3631167028862be2a173976ca11",
  LIQUID_LOCKERS: [
    {
      // Penpie
      address: "0x6e799758cee75dae3d84e09d40dc416ecf713652",
      receiptToken: "0x53777aDc5139f4230aEf6Da4b4E78A4faD4BB8c7",
    },
    {
      // EQB
      address: "0x64627901dadb46ed7f275fd4fc87d086cff1e6e3",
      receiptToken: "0x68404945A6038fe38452e9594E8AF2F4f6591D93",
    },
    // {   // STAKEDAO
    //     address: '0xd8fa8dc5adec503acc5e026a98f32ca5c1fa289a',
    //     receiptToken: '0xdd9df6a77b4a4a07875f55ce5cb6b933e52cb30a',
    // }
  ],
};

export const V1_END_TIMESTAMP = 1720368000n; // 2024-06-26 23:59:59 UTC

export const MULTIPLIERS = {
  campaign: {
    startTimestamp: 1719187200n, // 2024-06-24 00:00:00 UTC
    endTimestamp: 1720656000n, // 2024-07-10 00:00:00 UTC
    multiplier: 200n,
  },
  multiplier: 150n,
  baseFactor: 100n,
  expiry: 1724284800n, // 2024-08-22 00:00:00 UTC
};
