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
  SY: "0x34349c5569e7b846c3558961552d2202760a9789",
  YT: "0x029aad400f6092dc735a65be95102efcc2fe64bf",
  LP: "0x445d25a1c31445fb29e65d12da8e0eea38174176",
  START_BLOCK: 19516901,
  TREASURY: "0x8270400d528c34e1596ef367eedec99080a1b592",
  EQB_STAKING: "0xe0402eab6019013e6ba5386559f9ca27735f83c1",
  PENPIE_RECEIPT_TOKEN: "0x2053e178a70daa28a40d09563d99aa6abdc82130",
  // STAKEDAO_RECEIPT_TOKEN: "0xdd9df6a77b4a4a07875f55ce5cb6b933e52cb30a",
  MULTICALL: "0xca11bde05977b3631167028862be2a173976ca11",
  LIQUID_LOCKERS: [
    {
      // Penpie
      address: "0x6e799758cee75dae3d84e09d40dc416ecf713652",
      receiptToken: "0x2053e178a70daa28a40d09563d99aa6abdc82130",
    },
    {
      // EQB
      address: "0x64627901dadb46ed7f275fd4fc87d086cff1e6e3",
      receiptToken: "0xe0402eab6019013e6ba5386559f9ca27735f83c1",
    },
    // {   // STAKEDAO
    //     address: '0xd8fa8dc5adec503acc5e026a98f32ca5c1fa289a',
    //     receiptToken: '0xdd9df6a77b4a4a07875f55ce5cb6b933e52cb30a',
    // }
  ],
};
