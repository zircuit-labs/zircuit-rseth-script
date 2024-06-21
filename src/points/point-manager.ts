
import { LogLevel } from "@sentio/sdk";
import { EthContext } from "@sentio/sdk/eth";
import { MISC_CONSTS, PENDLE_POOL_ADDRESSES } from "../consts.js";
import { EVENT_POINT_INCREASE, POINT_SOURCE, POINT_SOURCE_YT } from "../types.js";

/**
 *
 * @param amountRsEthHolding amount of rsEth user holds during the period
 * @param holdingPeriod amount of time user holds the rsEth
 * @returns Zircuit point
 *
 * @dev to be reviewed by Zircuit team
 */
function calcPointsFromHolding(
  amountRsEthHolding: bigint,
  holdingStartTimestamp: bigint,
  holdingEndTimestamp: bigint,
): bigint {
  
  const cuttoffTimestamp = 1719446400n // 27/06 12:00 AM GMT

  if(holdingStartTimestamp >= cuttoffTimestamp) return BigInt(0)
  if(holdingEndTimestamp >= cuttoffTimestamp) holdingEndTimestamp = cuttoffTimestamp

  const holdingPeriod = holdingEndTimestamp - holdingStartTimestamp
  // * rsETH exchangeRate
  return amountRsEthHolding * MISC_CONSTS.RSETH_POINT_RATE / MISC_CONSTS.ONE_E18 * holdingPeriod / 3600n;
}

export function updatePoints(
  ctx: EthContext,
  label: POINT_SOURCE,
  account: string,
  amountRsEthHolding: bigint,
  holdingStartTimestamp:bigint,
  holdingEndTimestamp:bigint,
  updatedAt: number
) {
  const zPoint = calcPointsFromHolding(
    amountRsEthHolding,
    holdingStartTimestamp,
    holdingEndTimestamp
  );

  if (label == POINT_SOURCE_YT) {
    const zPointTreasuryFee = calcTreasuryFee(zPoint);
    increasePoint(
      ctx,
      label,
      account,
      amountRsEthHolding,
      holdingPeriod,
      zPoint - zPointTreasuryFee,
      updatedAt
    );
    increasePoint(
      ctx,
      label,
      PENDLE_POOL_ADDRESSES.TREASURY,
      0n,
      holdingPeriod,
      zPointTreasuryFee,
      updatedAt
    );
  } else {
    increasePoint(
      ctx,
      label,
      account,
      amountRsEthHolding,
      holdingPeriod,
      zPoint,
      updatedAt
    );
  }
}

function increasePoint(
  ctx: EthContext,
  label: POINT_SOURCE,
  account: string,
  amountRsEthHolding: bigint,
  holdingPeriod: bigint,
  zPoint: bigint,
  updatedAt: number
) {
  ctx.eventLogger.emit(EVENT_POINT_INCREASE, {
    label,
    account: account.toLowerCase(),
    amountRsEthHolding: amountRsEthHolding.scaleDown(18),
    holdingPeriod,
    zPoint: zPoint.scaleDown(18),
    updatedAt,
    severity: LogLevel.INFO,
  });
}

function calcTreasuryFee(amount: bigint): bigint {
  return (amount * 3n) / 100n;
}
