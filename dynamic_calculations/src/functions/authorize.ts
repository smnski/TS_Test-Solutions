import { User } from "../models/user"
import { Action } from "../models/action";
import { Role } from "../models/role";

const RoleImportance: Record<string, number> = {
  [Role.BASIC_USER]: 0,
  [Role.ENTERPRISE_USER]: 1,
  [Role.LOCAL_ADMIN]: 2,
  [Role.SYS_ADMIN]: 3,
};

export async function authorize(userId: string, actionId: string) {

  const userRes = await User.getById(userId);
  const actionRes = await Action.getById(actionId);

  if (userRes && actionRes) {
    return RoleImportance[userRes.role as string] >= RoleImportance[actionRes.role as string];
  }

  return false;
}
