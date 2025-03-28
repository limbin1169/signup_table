import { Table, Dropdown, Checkbox } from "antd";
import { useCoreStore } from "../CoreProvider";
import { MoreOutlined } from "@ant-design/icons";
import { styled } from "styled-components";
import { FieldModel, RecordModel } from "../models";
import { Observer } from "mobx-react";
import { toJS } from "mobx";
import { useState } from "react";

interface RecordTableProps {
  records: RecordModel[];
  fields: FieldModel[];
  onEdit: (data: RecordModel) => void;
}

export const RecordTable: React.FC<RecordTableProps> = ({
  records,
  fields,
  onEdit,
}) => {
  const { recordStore } = useCoreStore();
  const [current, setCurrent] = useState<Partial<RecordModel>[]>([]);
  const getColumnWidth = (fieldId: string) => {
    switch (fieldId) {
      case "id":
        return 0;
      case "name":
        return 120;
      case "address":
        return 250;
      case "memo":
        return 250;
      case "regiDate":
        return 200;
      case "job":
        return 250;
      case "isMailAgreed":
        return 150;
      default:
        return 120;
    }
  };

  const handleMenuClick = (key: string, record: RecordModel) => {
    switch (key) {
      case "edit":
        onEdit(record);
        break;
      case "delete":
        if (current.length > 1) {
          recordStore.removeRecords(current);
        } else {
          recordStore.removeRecord(record.id);
        }

        break;
      default:
        break;
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: RecordModel[]) => {
      setCurrent(selectedRows);
    },
  };

  return (
    <Observer>
      {() => {
        const dataSource = toJS(records);

        const fieldColumns = fields.map((field) => {
          const uniqueValues = Array.from(
            new Set(
              dataSource.map((record) => record[field.id as keyof RecordModel])
            )
          ).filter((value) => value !== undefined && value !== null);

          const filterOptions = uniqueValues.map((value) => ({
            text: String(value),
            value: value,
          }));

          const column: any = {
            title: field.label,
            dataIndex: field.id,
            key: field.id,
            width: getColumnWidth(field.id),
            filters: filterOptions.length > 0 ? filterOptions : undefined,
            onFilter: (value: any, record: RecordModel) => {
              const fieldValue = record[field.id as keyof RecordModel];

              if (typeof fieldValue === "boolean") {
                return fieldValue === (value === "true");
              }

              return String(fieldValue).includes(String(value));
            },
          };

          if (field.id === "isMailAgreed") {
            column.render = (value: boolean) => <Checkbox checked={value} />;
            column.filters = [
              { text: "선택됨", value: "true" },
              { text: "선택 안함", value: "false" },
            ];
          }

          return column;
        });

        const actionColumn = {
          title: "",
          key: "action",
          width: 50,
          render: (_: any, record: RecordModel) => (
            <Dropdown
              overlayStyle={{ width: "180px" }}
              menu={{
                items: [
                  {
                    key: "edit",
                    label: "수정",
                    onClick: () => handleMenuClick("edit", record),
                    disabled: current.length !== 0,
                  },
                  { type: "divider" },
                  {
                    key: "delete",
                    label: "삭제",
                    danger: true,
                    onClick: () => handleMenuClick("delete", record),
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <ActionButton onClick={(e) => e.preventDefault()}>
                <MoreOutlined />
              </ActionButton>
            </Dropdown>
          ),
        };

        const columns = [...fieldColumns, actionColumn];

        return (
          <Table
            columns={columns}
            dataSource={dataSource}
            rowSelection={{ type: "checkbox", ...rowSelection }}
            rowKey="id"
          />
        );
      }}
    </Observer>
  );
};

export default RecordTable;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.65);

  &:hover {
    color: #1890ff;
  }

  .anticon {
    font-size: 16px;
  }
`;
