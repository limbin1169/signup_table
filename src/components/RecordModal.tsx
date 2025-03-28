import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from "antd";
import { useCoreStore } from "../CoreProvider";
import { Observer } from "mobx-react";
import styled from "styled-components";
import { FieldModel, JobType, RecordModel } from "../models";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { toJS } from "mobx";

interface RecordModalProps {
  open: boolean;
  onClose: () => void;
  fields: FieldModel[];
  initialValues?: RecordModel;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  open,
  onClose,
  fields,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { recordStore } = useCoreStore();
  const [formValues, setFormValues] = useState<Partial<RecordModel>>({});

  const isSubmitDisabled = !formValues.name || !formValues.regiDate;
  useEffect(() => {
    if (open) {
      form.resetFields();
      setFormValues({});

      if (initialValues) {
        const values = { ...initialValues };
        form.setFieldsValue(values);
        setFormValues(values);
      } else {
        form.setFieldsValue({ job: "개발자" });
        setFormValues({ job: "개발자" });
      }
    }
  }, [open, initialValues, form, fields]);

  const handleValuesChange = (changedValues: any) => {
    setFormValues((prev) => ({ ...prev, ...changedValues }));
  };

  const handleFinish = () => {
    console.log(`formValues`, formValues);
    recordStore.addRecord(formValues);
    console.log(toJS(recordStore.records));
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    if (Array.isArray(dateString)) return;
    setFormValues((prev) => ({ ...prev, regiDate: dateString }));
  };

  const handleSelectChange = (value: JobType) => {
    form.setFieldValue("job", value);
  };

  const renderItems = (field: FieldModel) => {
    const { type, label, selectBoxOptions } = field;

    switch (type) {
      case "text":
        return <Input placeholder={"Input"} />;
      case "textarea":
        return <TextArea rows={4} placeholder={"Textarea"} />;
      case "date":
        return (
          <DatePicker
            style={{ width: "100%" }}
            placeholder={"Select date"}
            onChange={handleDateChange}
          />
        );
      case "select":
        return (
          <Select style={{ width: `85px` }} onChange={handleSelectChange}>
            {selectBoxOptions?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "checkbox":
        return <Checkbox />;
      default:
        return <Input placeholder={`${label} 입력`} />;
    }
  };

  return (
    <Observer>
      {() => (
        <StyledModal
          title="회원 추가"
          open={open}
          width={520}
          onCancel={onClose}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
            autoComplete="off"
          >
            {fields.map((field) => (
              <Form.Item
                key={field.id}
                name={field.id}
                label={
                  field.required ? (
                    <div style={{ gap: "4px", display: "flex" }}>
                      {field.label}
                      <span style={{ color: "red" }}>*</span>
                    </div>
                  ) : (
                    field.label
                  )
                }
                valuePropName={field.type === "checkbox" ? "checked" : "value"}
              >
                {renderItems(field)}
              </Form.Item>
            ))}
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <Button onClick={onClose}>취소</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitDisabled}
                >
                  확인
                </Button>
              </div>
            </Form.Item>
          </Form>
        </StyledModal>
      )}
    </Observer>
  );
};

const StyledModal = styled(Modal)`
  & .ant-modal-content {
    padding: 12px;
  }
`;
