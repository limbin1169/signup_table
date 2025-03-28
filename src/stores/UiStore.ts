import { makeAutoObservable } from "mobx";
import { RecordModel } from "../models";

export class UiStore {
  private _isModalOpen: boolean = false;
  private _currentRecord: RecordModel | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get isModalOpen() {
    return this._isModalOpen;
  }
  get currentRecord() {
    return this._currentRecord;
  }

  setIsModalOpen(flag: boolean) {
    this._isModalOpen = flag;
  }

  setCurrentRecord(record?: RecordModel) {
    this._currentRecord = record;
  }
}
