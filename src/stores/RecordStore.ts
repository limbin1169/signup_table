import { makeAutoObservable } from "mobx";
import {
  columnFields,
  FieldModel,
  initialRecords,
  RecordModel,
} from "../models";

export class RecordStore {
  private _records: RecordModel[] = [];
  private _fields: FieldModel[] = columnFields;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  get records() {
    return this._records;
  }

  get fields() {
    return this._fields;
  }

  init() {
    this._records = [...initialRecords];
  }

  addRecord(data: Partial<RecordModel>) {
    const newRecord = new RecordModel(data);
    this._records = [...this._records, newRecord];
  }

  updateRecord(data: Partial<RecordModel>) {
    const target = this._records.find((record) => data.id === record.id);
    if (!target) return;

    target.setValues(data);
  }

  removeRecord(id: string) {
    this._records = this._records.filter((record) => record.id !== id);
  }
}
