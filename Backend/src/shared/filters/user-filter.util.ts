import { UserQueryParams, UserFilterResult } from './user-filter.types';

export function buildUserFilter(query: UserQueryParams): UserFilterResult {
  const { search, role, isActive, verify, companyName, page, limit, sortBy, sortOrder } = query;

  const profileWhere: Record<string, any> = {
    ...(search
      ? {
          OR: [
            { username: { contains: search } },
            { first_name: { contains: search } },
            { last_name: { contains: search } },
            { company_name: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
    ...(typeof isActive === 'boolean' ? { isActive } : {}),
    ...(typeof verify === 'boolean' ? { verify } : {}),
    ...(companyName ? { company_name: { contains: companyName } } : {}),
  };

  const where = Object.keys(profileWhere).length ? { profile: profileWhere } : {};

  const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
  const take = limit ? Number(limit) : undefined;

  const orderBy = sortBy
    ? { [sortBy]: sortOrder === 'asc' ? ('asc' as const) : ('desc' as const) }
    : { createAt: 'desc' as const };

  return { where, orderBy, skip, take };
}