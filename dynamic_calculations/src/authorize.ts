import { User } from "./models/user";
import Role from "./models/role";

const RoleImportance = {
  [Role.BASIC_USER]: 0,
  [Role.ENTERPRISE_USER]: 1,
  [Role.LOCAL_ADMIN]: 2,
  [Role.SYS_ADMIN]: 3,
};


async function authorize(userId: string) {

  const user = await User.getByPk(userId);

  return true;
}

export default authorize;
