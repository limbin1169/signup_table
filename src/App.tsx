import React, { useState } from "react";
import { Button, Checkbox, Table, Dropdown } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styled from "styled-components";
import { MoreOutlined } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  name: string;
  regiDate: string;
  address?: string;
  memo?: string;
  job?: "개발자" | "PO" | "디자이너";
  isMailAgreed?: boolean;
}

const App: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleMenuClick = (key: string, record: DataType) => {
    switch (key) {
      case "edit":
        console.log("Edit clicked for", record);
        // 수정 로직 구현
        break;
      case "delete":
        console.log("Delete clicked for", record);
        // 삭제 로직 구현
        break;
      default:
        break;
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "이름",
      dataIndex: "name",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
      ],
      onFilter: (value, record) => record.name.includes(value as string),
      width: "25%",
    },
    {
      title: "주소",
      dataIndex: "address",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
      ],
    },
    {
      title: "메모",
      dataIndex: "memo",
    },
    {
      title: "가입일",
      dataIndex: "regiDate",
    },
    {
      title: "직업",
      dataIndex: "job",
    },
    {
      title: "이메일 수신 동의",
      dataIndex: "isMailAgreed",
      render: (value: boolean) => <Checkbox checked={value} />,
    },
    {
      title: "",
      width: 50,
      render: (_, record) => (
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
    },
  ];

  const data: DataType[] = [
    {
      key: 1,
      name: "John Brown",
      address: "서울 강남구",
      memo: "외국인",
      regiDate: "2024-10-02",
      job: "개발자",
      isMailAgreed: true,
    },
    {
      key: 2,
      name: "Foo Bar",
      address: "서울 서초구",
      memo: "한국인",
      regiDate: "2024-10-01",
      job: "PO",
      isMailAgreed: false,
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <>
      <TitleWrapper>
        <Title>회원목록</Title>
        <AddButton type="primary">+ 추가</AddButton>
      </TitleWrapper>

      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        onChange={onChange}
      />
    </>
  );
};

export default App;

const Title = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled(Button)`
  width: 73px;
  height: 32px;
  border-radius: 8px;
  border-width: 1px;
`;

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
