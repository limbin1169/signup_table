import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from "antd";
import { useCoreStore } from "../CoreProvider";
import { Observer } from "mobx-react";
import styled from "styled-components";
import { FieldModel, RecordModel } from "../models";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { CloseOutlined } from "@ant-design/icons";

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

  const handleSubmitClick = () => {
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
        return (
          <TextArea
            rows={4}
            placeholder={"Textarea"}
            style={{ resize: "none" }}
          />
        );
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
          <Select>
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
          open={open}
          width={520}
          closable={false}
          onCancel={onClose}
          footer={null}
        >
          <Header>
            <span>{initialValues ? "회원 수정" : "회원 추가"}</span>
            <CloseOutlined onClick={onClose} />
          </Header>
          <StyledForm
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            autoComplete="off"
          >
            {fields.map((field) => (
              <StyledFormItem
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
              </StyledFormItem>
            ))}
          </StyledForm>
          <FooterWrapper>
            <Button onClick={onClose}>취소</Button>
            <Button
              type="primary"
              onClick={handleSubmitClick}
              disabled={isSubmitDisabled}
            >
              저장
            </Button>
          </FooterWrapper>
        </StyledModal>
      )}
    </Observer>
  );
};

const StyledModal = styled(Modal)`
  & .ant-modal-content {
    padding: 0px;
  }
`;

const Header = styled.div`
  height: 46px;

  border-bottom: 1px solid;
  border-color: #f0f0f0;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
  }
`;

const StyledForm = styled(Form)`
  padding: 10px 24px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  div:nth-child(3) {
    height: 104px;
  }
  div:nth-child(4) {
    width: 162px;
  }
  div:nth-child(5) {
    width: 91px;
  }
  div:nth-child(6) {
    height: 62px;
  }
`;

const StyledFormItem = styled(Form.Item)`
  margin: 0;
  height: 72px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  textarea {
    height: 64px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }
`;

const FooterWrapper = styled.div`
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  border-top: 1px solid;
  border-color: #f0f0f0;
`;
