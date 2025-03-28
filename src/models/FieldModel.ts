import { makeAutoObservable } from "mobx";

export type FieldType = "text" | "textarea" | "date" | "select" | "checkbox";

export interface SelectBoxOptionType {
  value: string;
  label: string;
}

export class FieldModel {
  id: string = "";
  type: FieldType = "text";
  label: string = "";
  required: boolean = false;
  selectBoxOptions?: SelectBoxOptionType[];

  constructor(data?: Partial<FieldModel>) {
    if (data) {
      Object.assign(this, data);
    }

    makeAutoObservable(this);
  }
}

export const columnFields: FieldModel[] = [
  new FieldModel({
    id: "name",
    type: "text",
    label: "이름",
    required: true,
  }),
  new FieldModel({
    id: "address",
    type: "text",
    label: "주소",
    required: false,
  }),
  new FieldModel({
    id: "memo",
    type: "textarea",
    label: "메모",
    required: false,
  }),
  new FieldModel({
    id: "regiDate",
    type: "date",
    label: "가입일",
    required: true,
  }),
  new FieldModel({
    id: "job",
    type: "select",
    label: "직업",
    required: false,
    selectBoxOptions: [
      { value: "개발자", label: "개발자" },
      { value: "PO", label: "PO" },
      { value: "디자이너", label: "디자이너" },
    ],
  }),
  new FieldModel({
    id: "isMailAgreed",
    type: "checkbox",
    label: "이메일 수신 동의",
    required: false,
  }),
];
