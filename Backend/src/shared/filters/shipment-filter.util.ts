import { ShipmentQueryParams, ShipmentFilterResult } from './shipment-filter.types';

export function buildShipmentFilter(query: ShipmentQueryParams): ShipmentFilterResult {
  const {
    type,
    status,
    goodsType,
    packaging,
    budgetType,
    paymentType,
    minWeight,
    maxWeight,
    minLength,
    maxLength,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    pickupAt,
    deliveryAt,
    urgent,
    stacking,
    additionalInsurance,
    twoDrivers,
    noFriday,
    search,
    page,
    limit,
    sortBy,
    sortOrder,
  } = query;

  const where = {
    ...(type ? { shipmentType: type } : {}),
    ...(status
      ? {
          status: {
            in: Array.isArray(status)
              ? status
              : status.split(',').map((s) => s.trim()),
          },
        }
      : {}),
    ...(goodsType ? { goodsType } : {}),
    ...(packaging ? { packaging } : {}),
    ...(budgetType ? { budgetType } : {}),
    ...(paymentType ? { paymentType } : {}),
    ...(urgent ? { urgent: true } : {}),
    ...(stacking ? { stacking: true } : {}),
    ...(additionalInsurance ? { additionalInsurance: true } : {}),
    ...(twoDrivers ? { twoDrivers: true } : {}),
    ...(noFriday ? { noFriday: true } : {}),
    ...(!isNaN(Number(minWeight)) && !isNaN(Number(maxWeight))
      ? {
          AND: [
            { weight: { gt: Number(minWeight) } },
            { weight: { lte: Number(maxWeight) } },
          ],
        }
      : {}),
    ...(!isNaN(Number(minLength)) && !isNaN(Number(maxLength))
      ? {
          AND: [
            { length: { gt: Number(minLength) } },
            { length: { lte: Number(maxLength) } },
          ],
        }
      : {}),
    ...(!isNaN(Number(minWidth)) && !isNaN(Number(maxWidth))
      ? {
          AND: [
            { width: { gt: Number(minWidth) } },
            { width: { lte: Number(maxWidth) } },
          ],
        }
      : {}),
    ...(!isNaN(Number(minHeight)) && !isNaN(Number(maxHeight))
      ? {
          AND: [
            { height: { gt: Number(minHeight) } },
            { height: { lte: Number(maxHeight) } },
          ],
        }
      : {}),
    ...(pickupAt
      ? {
          pickupAt: {
            gte: new Date(`${pickupAt}T00:00:00.000Z`),
            lte: new Date(`${pickupAt}T23:59:59.999Z`),
          },
        }
      : {}),
    ...(deliveryAt
      ? {
          deliveryAt: {
            gte: new Date(`${deliveryAt}T00:00:00.000Z`),
            lte: new Date(`${deliveryAt}T23:59:59.999Z`),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { origin: { contains: search } },
            { destination: { contains: search } },
          ],
        }
      : {}),
  };

  const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
  const take = limit ? Number(limit) : undefined;

  const orderBy = sortBy
    ? { [sortBy]: sortOrder === 'asc' ? 'asc' as const : 'desc' as const }
    : { createAt: 'desc' as const };

  return { where, orderBy, skip, take };
}
