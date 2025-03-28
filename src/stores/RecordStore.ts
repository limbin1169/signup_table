import { makeAutoObservable, transaction } from "mobx";
import {
  columnFields,
  FieldModel,
  initialRecords,
  RecordModel,
} from "../models";

export class RecordStore {
  private _records: RecordModel[] = [];
  private _fields: FieldModel[] = columnFields;
  private isLocalStorage = false;

  constructor() {
    makeAutoObservable(this);
    this.isLocalStorage = import.meta.env.VITE_STORAGE === "local-storage";
    this.init();
  }

  get records() {
    return this._records;
  }

  get fields() {
    return this._fields;
  }

  init() {
    if (this.isLocalStorage) {
      const fetchData = localStorage.getItem("record-data");
      if (fetchData) {
        this._records = JSON.parse(fetchData).map(
          (data: any) => new RecordModel(data)
        );
      } else {
        this._records = [...initialRecords];
      }
    } else {
      this._records = [...initialRecords];
    }
  }

  addRecord(data: Partial<RecordModel>) {
    const newRecord = new RecordModel(data);
    this._records = [...this._records, newRecord];
    if (this.isLocalStorage) this.saveRecord();
  }

  updateRecord(data: Partial<RecordModel>) {
    const target = this._records.find((record) => data.id === record.id);
    if (!target) return;

    target.setValues(data);
    if (this.isLocalStorage) this.saveRecord();
  }

  removeRecord(id: string) {
    this._records = this._records.filter((record) => record.id !== id);
    if (this.isLocalStorage) this.saveRecord();
  }

  removeRecords(data: Partial<RecordModel>[]) {
    if (!data.length) return;

    const targets = data.map((record) => record.id);
    transaction(() => {
      this._records = this._records.filter(
        (record) => !targets.includes(record.id)
      );
    });
    if (this.isLocalStorage) this.saveRecord();
  }

  saveRecord() {
    const savedData = JSON.stringify(this._records);
    localStorage.setItem("record-data", savedData);
  }
}
