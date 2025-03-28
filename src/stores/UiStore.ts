import { makeAutoObservable } from "mobx";

export class UiStore {
  private _isModalOpen: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  get isModalOpen() {
    return this._isModalOpen;
  }

  setIsModalOpen(flag: boolean) {
    this._isModalOpen = flag;
  }
}
