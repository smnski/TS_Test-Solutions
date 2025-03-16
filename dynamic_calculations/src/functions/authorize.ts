import { User } from "../models/user"
import { Action } from "../models/action";
import { Role } from "../models/role";

const RoleImportance: Record<string, number> = {
  [Role.BASIC_USER]: 0,
  [Role.ENTERPRISE_USER]: 1,
  [Role.LOCAL_ADMIN]: 2,
  [Role.SYS_ADMIN]: 3,
};

export async function authorize(action: Action, user: User) {
  if (!action.role) {
    return true;
  }

  if (user.role) {
    return RoleImportance[user.role as string] >= RoleImportance[action.role as string];
  }

  return false;
}
