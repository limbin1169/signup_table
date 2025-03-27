import { makeAutoObservable } from "mobx";

export type JobType = "개발자" | "PO" | "디자이너";

export class MemberModel {
  key: React.Key;
  name: string;
  address?: string;
  memo?: string;
  regiDate: string;
  job?: JobType;
  isMailAgreed: boolean;

  constructor(data?: Partial<MemberModel>) {
    this.key = Date.now();
    this.name = "";
    this.regiDate = "";
    this.isMailAgreed = false;

    if (data) {
      this.setValues(data);
    }

    makeAutoObservable(this);
  }

  setValues(data: Partial<MemberModel>) {
    if ("key" in data && data.key !== undefined) this.key = data.key;
    if ("name" in data && data.name !== undefined) this.name = data.name;
    if ("address" in data) this.address = data.address;
    if ("memo" in data) this.memo = data.memo;
    if ("regiDate" in data && data.regiDate !== undefined)
      this.regiDate = data.regiDate;
    if ("job" in data) this.job = data.job;
    if ("isMailAgreed" in data && data.isMailAgreed !== undefined)
      this.isMailAgreed = data.isMailAgreed;
  }
}

export type MemberModelType = MemberModel;
