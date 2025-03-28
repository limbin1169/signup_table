import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from "antd";
import { useCoreStore } from "../CoreProvider";
import { Observer } from "mobx-react";
import styled from "styled-components";
import { FieldModel, RecordModel } from "../models";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

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

        const formValues = { ...values };

        if (values.regiDate) {
          const dayjsObj = dayjs(values.regiDate);
          if (dayjsObj.isValid()) {
            formValues.regiDate = dayjsObj;
          }
        }

        form.setFieldsValue(formValues);
        setFormValues(values);
      } else {
        form.setFieldsValue({ job: "개발자" });
        setFormValues({ job: "개발자" });
      }
    }
  }, [open, initialValues, form, fields]);

  const handleValuesChange = (changedValues: any) => {
    const updatedValues = { ...changedValues };

    Object.keys(changedValues).forEach((key) => {
      const field = fields.find((x) => x.id === key);
      if (field?.type === "date" && changedValues[key]) {
        updatedValues[key] = changedValues[key].format("YYYY-MM-DD");
      }
    });

    setFormValues((prev) => ({ ...prev, ...updatedValues }));
  };

  const handleFinish = () => {
    const values = { ...formValues };
    if (initialValues) {
      recordStore.updateRecord(values);
    } else {
      recordStore.addRecord(values);
    }

    onClose();
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
            format="YYYY-MM-DD"
          />
        );
      case "select":
        return (
          <Select style={{ width: `85px` }}>
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
          title={initialValues ? "회원 수정" : "회원 추가"}
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
