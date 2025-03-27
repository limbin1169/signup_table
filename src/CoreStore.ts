import { MemberStore } from "./stores";

export class CoreStore {
  memberStore: MemberStore = new MemberStore();
}

export const coreStore = new CoreStore();
