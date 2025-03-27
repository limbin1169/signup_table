import { makeAutoObservable } from "mobx";
import { MemberModel, MemberModelType } from "./MemberModel";

export class MemberStore {
  private _members: MemberModel[] = [];

  constructor() {
    makeAutoObservable(this);
    this._members = [
      new MemberModel({
        key: 1,
        name: "John Brown",
        address: "서울 강남구",
        memo: "외국인",
        regiDate: "2024-10-02",
        job: "개발자",
        isMailAgreed: true,
      }),
      new MemberModel({
        key: 2,
        name: "Foo Bar",
        address: "서울 서초구",
        memo: "한국인",
        regiDate: "2024-10-01",
        job: "PO",
        isMailAgreed: false,
      }),
    ];
  }

  get members() {
    return this._members;
  }

  addMember(data: Partial<MemberModel>): MemberModel {
    const newMember = new MemberModel(data);
    this._members = [...this._members, newMember];
    return newMember;
  }

  updateMember(key: React.Key, data: Partial<MemberModelType>) {
    const memberIndex = this._members.findIndex((member) => member.key === key);
    if (memberIndex > -1) {
      const updateMembers = [...this._members];
      updateMembers[memberIndex].setValues(data);
      this._members = updateMembers;
    }
  }

  removeMember(key: React.Key) {
    if (!key) return;
    this._members = this._members.filter((member) => member.key !== key);
  }
}
