import { LogLevel } from "@sentio/sdk";
import { EthContext } from "@sentio/sdk/eth";
import {
  MISC_CONSTS,
  PENDLE_POOL_ADDRESSES,
  MULTIPLIERS,
  V1_END_TIMESTAMP,
} from "../consts.js";
import {
  EVENT_POINT_INCREASE,
  POINT_SOURCE,
  POINT_SOURCE_YT,
  POINT_SOURCE_SY,
} from "../types.js";

/**
 *
 * @param amountRsEthHolding amount of rsEth user holds during the period
 * @param holdingStartTimestamp start timestamp of the holding period
 * @param holdingEndTimestamp end timestamp of the holding period
 * @returns Zircuit point
 *
 * @dev to be reviewed by Zircuit team
 */
function calcPointsFromHolding(
  amountRsEthHolding: bigint,
  holdingStartTimestamp: bigint,
  holdingEndTimestamp: bigint
): bigint {
  const campaignStartTime = MULTIPLIERS.campaign.startTimestamp;
  const campaignEndTime = MULTIPLIERS.campaign.endTimestamp;
  const campaignMultiplier = MULTIPLIERS.campaign.multiplier;
  const baseMultiplier = MULTIPLIERS.multiplier;
  const baseFactor = MULTIPLIERS.baseFactor;

  // * rsETH exchangeRate
  let points =
    (amountRsEthHolding *
      MISC_CONSTS.RSETH_POINT_RATE *
      (holdingEndTimestamp - holdingStartTimestamp) *
      baseMultiplier) /
    3600n /
    baseFactor /
    MISC_CONSTS.ONE_E18;

  if (
    holdingStartTimestamp < campaignStartTime &&
    holdingEndTimestamp >= campaignStartTime
  ) {
    // start before campaign start, end after campaign start
    const endTime =
      holdingEndTimestamp < campaignEndTime
        ? holdingEndTimestamp
        : campaignEndTime;
    // there's already 1 times points from the points calculation so we need to subtract 1 from campaignMultiplier
    points +=
      (amountRsEthHolding *
        MISC_CONSTS.RSETH_POINT_RATE *
        (endTime - campaignStartTime) *
        (campaignMultiplier - baseMultiplier)) /
      MISC_CONSTS.ONE_E18 /
      3600n /
      baseFactor;
  } else if (
    holdingStartTimestamp >= campaignStartTime &&
    holdingStartTimestamp <= campaignEndTime
  ) {
    // start after campaign start, and before campaign end
    const endTime =
      holdingEndTimestamp < campaignEndTime
        ? holdingEndTimestamp
        : campaignEndTime;
    // there's already 1 times points from the points calculation so we need to subtract 1 from campaignMultiplier
    points +=
      (amountRsEthHolding *
        MISC_CONSTS.RSETH_POINT_RATE *
        (endTime - holdingStartTimestamp) *
        (campaignMultiplier - baseMultiplier)) /
      MISC_CONSTS.ONE_E18 /
      3600n /
      baseFactor;
  }

  return points;
}

/**
 * @dev Since the same SY contract is used for the new pool and the old pool,
 * it's possible to double count the points if calculation starts before v1 processor end time.
 * For the V2 processor, we need to make sure the SY points are only calculated after the V1 processor stops.
 */
export function updatePoints(
  ctx: EthContext,
  label: POINT_SOURCE,
  account: string,
  amountRsEthHolding: bigint,
  holdingStartTimestamp: bigint,
  holdingEndTimestamp: bigint,
  updatedAt: number
) {
  if (label == POINT_SOURCE_SY) {
    if (holdingEndTimestamp <= V1_END_TIMESTAMP) {
      return;
    }

    holdingStartTimestamp =
      holdingStartTimestamp < V1_END_TIMESTAMP + 1n
        ? V1_END_TIMESTAMP + 1n
        : holdingStartTimestamp;
  }
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
      holdingEndTimestamp - holdingStartTimestamp,
      zPoint - zPointTreasuryFee,
      updatedAt
    );
    increasePoint(
      ctx,
      label,
      PENDLE_POOL_ADDRESSES.TREASURY,
      0n,
      holdingEndTimestamp - holdingStartTimestamp,
      zPointTreasuryFee,
      updatedAt
    );
  } else {
    increasePoint(
      ctx,
      label,
      account,
      amountRsEthHolding,
      holdingEndTimestamp - holdingStartTimestamp,
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
