import { UserRole } from "@prisma/client";

export const formatRoles = (roles: Omit<UserRole, "userId">[]) => {
  return roles.map((roles) => roles.role);
};
