import { RecordStore, UiStore } from "./stores";

export class CoreStore {
  recordStore: RecordStore = new RecordStore();
  uiStore: UiStore = new UiStore();
}

export const coreStore = new CoreStore();
