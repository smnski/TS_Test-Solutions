export class Role {
  static SYS_ADMIN = "sysadmin";
  static LOCAL_ADMIN = "localadmin";
  static ENTERPRISE_USER = "enterpriseuser";
  static BASIC_USER = "basicuser";

  static from(input: string) {
    switch (input) {
      case Role.SYS_ADMIN: return Role.SYS_ADMIN;
      case Role.LOCAL_ADMIN: return Role.LOCAL_ADMIN;
      case Role.ENTERPRISE_USER: return Role.ENTERPRISE_USER;
      case Role.BASIC_USER: return Role.BASIC_USER;
      default: return undefined;
    }
  }
}