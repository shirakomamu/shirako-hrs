export interface IMemberRegisterPayload {
  id: string;
}

interface IPageGuardSingleton {
  path: string;
  result: boolean;
}

export interface IPageGuardPayload extends Array<IPageGuardSingleton> {}
