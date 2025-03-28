import { Table, Dropdown, Checkbox } from "antd";
import { useCoreStore } from "../CoreProvider";
import { MoreOutlined } from "@ant-design/icons";
import { styled } from "styled-components";
import { FieldModel, RecordModel } from "../models";
import { toJS } from "mobx";
import { Observer } from "mobx-react";

interface RecordTableProps {
  records: RecordModel[];
  fields: FieldModel[];
}

export const RecordTable: React.FC<RecordTableProps> = ({
  records,
  fields,
}) => {
  const { recordStore } = useCoreStore();

  const fieldColumns = fields.map((field) => {
    const column: any = {
      title: field.label,
      dataIndex: field.id,
      key: field.id,
      filters: [
        {
          text: field.type,
          value: "Joe",
        },
      ],
    };

    if (field.id === "isMailAgreed") {
      column.render = (value: boolean) => <Checkbox checked={value} />;
    }

    return column;
  });

  const actionColumn = {
    title: "",
    key: "action",
    width: 50,
    render: (_: any, record: RecordModel) => (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "수정",
              onClick: () => handleMenuClick("edit", record),
            },
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

  const handleMenuClick = (key: string, record: RecordModel) => {
    switch (key) {
      case "edit":
        recordStore.updateRecord({
          id: record.id,
          name: "임빈11111111111",
        });
        break;
      case "delete":
        recordStore.removeRecord(record.id);
        break;
      default:
        break;
    }
  };

  return (
    <Observer>
      {() => <Table columns={columns} dataSource={records} rowKey="id" />}
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
