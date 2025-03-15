import { User } from "./models/user";
import { Action } from "./models/action";
import { Role } from "./models/role";

const RoleImportance = {
  [Role.BASIC_USER]: 0,
  [Role.ENTERPRISE_USER]: 1,
  [Role.LOCAL_ADMIN]: 2,
  [Role.SYS_ADMIN]: 3,
};

export async function authorize(userId: string, actionId: string) {

  const userRes = await User.getByPk(userId);
  const actionRes = await Action.getByPk(actionId);

  if (userRes && actionRes) {
    return RoleImportance[userRes.role] >= RoleImportance[actionRes.role];
  }

  return false;
}
