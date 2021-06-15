import memoize from "memoizee";
import { Role, RoleGroup, HrbacOptions } from "src/services/hrbac";
import { Guard, GuardBehavior } from "src/services/guard";
import Actor from "./Actor";

type ResolvedRbacOptions = {
  [key in keyof RoleGroup as string]: Role[];
};

const DEFAULT_CHECK_BEHAVIOR = GuardBehavior.all;

interface Check {
  rgs: RoleGroup[];
  roles: Role[];

  // all = all roles must be accessible, by any of the rgs
  // any = any of the roles can be accessible, by any of the rgs
  mode?: GuardBehavior;
}

export default class Hrbac {
  public rro: Promise<ResolvedRbacOptions>;
  private memoizedCan: (check: Check) => boolean;

  constructor(ro: HrbacOptions | Promise<HrbacOptions>) {
    this.rro = new Promise((resolve) => resolve(this._initializeOptions(ro)));
    this.memoizedCan = this._getMemoizee();
  }

  public can(guard: Guard, actor?: Actor): boolean {
    const roleResult = this.memoizedCan({
      rgs: actor?.rgs || [],
      roles: guard.roles || [],
      mode: guard.mode,
    });

    // if simple roles checking fails, immediately return
    if (!roleResult) {
      return false;
    }

    // if it's true and there's no guards, then immediately true
    if (!guard.guards || !guard.guards.length) {
      return true;
    }

    // else, try to resolve the guards
    let guardResult = false;
    if (guard.mode === GuardBehavior.all) {
      guardResult = guard.guards.every((e) => this.can(e, actor));
    } else {
      guardResult = guard.guards.some((e) => this.can(e, actor));
    }

    return guardResult;
  }

  public reinitialize(ro: HrbacOptions | Promise<HrbacOptions>) {
    this.rro = new Promise((resolve) => resolve(this._initializeOptions(ro)));
    this.memoizedCan = this._getMemoizee();
  }

  private async _initializeOptions(
    ro: HrbacOptions | Promise<HrbacOptions>
  ): Promise<ResolvedRbacOptions> {
    const roRes = await ro;
    const rgs: ResolvedRbacOptions = {};
    for (const rg in ro) {
      const rga = [rg, ...this._getAllChildren(rg as RoleGroup, roRes)];
      const resolvedRoles = this._resolveRoleGroups(rga as RoleGroup[], roRes);
      rgs[rg] = resolvedRoles;
    }

    return rgs;
  }

  private _getMemoizee() {
    return memoize(this._can, {
      length: 1,
      primitive: true,
    });
  }

  private _getChildren(rg: RoleGroup, ro: HrbacOptions): RoleGroup[] {
    return ro[rg].inherits || [];
  }

  private _getChildrenWithSelf(rg: RoleGroup, ro: HrbacOptions): RoleGroup[] {
    return [
      rg,
      ...this._getChildren(rg, ro).flatMap((e) =>
        this._getChildrenWithSelf(e, ro)
      ),
    ];
  }

  private _getAllChildren(rg: RoleGroup, ro: HrbacOptions): RoleGroup[] {
    return this._getChildren(rg, ro)
      .flatMap((e) => this._getChildrenWithSelf(e, ro))
      .filter((e, i, a) => a.indexOf(e) === i);
  }

  private _resolveRoleGroups(rga: RoleGroup[], ro: HrbacOptions): Role[] {
    return rga
      .flatMap((e) => ro[e].roles)
      .filter((e, i, a) => a.indexOf(e) === i);
  }

  private async _validate(rg: RoleGroup, role: Role) {
    const rroRes = await this.rro;
    return rroRes[rg].includes(role);
  }

  private _can({ rgs, roles, mode = DEFAULT_CHECK_BEHAVIOR }: Check) {
    if (!roles.length) {
      // if no roles are checked, always true
      return true;
    }
    if (!rgs.length) {
      // if no rgs are present, always false
      return false;
    }
    return rgs.some((e) => {
      switch (mode) {
        case GuardBehavior.all:
          return roles.every((f) => this._validate(e, f));
        case GuardBehavior.some:
          return roles.some((f) => this._validate(e, f));
        default:
          return false;
      }
    });
  }
}
