import { makeAutoObservable } from "mobx";

export type JobType = "개발자" | "PO" | "디자이너";

export class RecordModel {
  id: string = "";
  name: string = "";
  address?: string;
  memo?: string;
  regiDate: string = "";
  job?: JobType;
  isMailAgreed: boolean = false;

  constructor(data?: Partial<RecordModel>) {
    if (data) {
      this.setValues(data);
    }

    makeAutoObservable(this);
  }

  setValues(data: Partial<RecordModel>) {
    if ("id" in data && data.id !== undefined) this.id = data.id;
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

export const initialRecords: RecordModel[] = [
  new RecordModel({
    id: "1",
    name: "John Doe",
    address: "서울 강남구",
    memo: "외국인",
    regiDate: "2024-10-02",
    job: "개발자",
    isMailAgreed: true,
  }),
  new RecordModel({
    id: "2",
    name: "Foo Bar",
    address: "서울 서초구",
    memo: "한국인",
    regiDate: "2024-10-01",
    job: "PO",
    isMailAgreed: false,
  }),
];
