import React, { useState } from "react";
import { Button, Checkbox, Table, Dropdown } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styled from "styled-components";
import { MoreOutlined } from "@ant-design/icons";
import { useCoreStore } from "./CoreProvider";
import { MemberModelType } from "./stores/MemberModel";
import { Observer } from "mobx-react";
import { toJS } from "mobx";

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { memberStore } = useCoreStore();

  const handleMenuClick = (key: string, member: MemberModelType) => {
    switch (key) {
      case "edit":
        memberStore.updateMember(member.key, {
          name: "임빈11111111111",
        });
        break;
      case "delete":
        memberStore.removeMember(member.key);
        break;
      default:
        break;
    }
  };

  const handleAddClick = () => {
    memberStore.addMember({
      key: Date.now(),
      name: "임빈",
      regiDate: "123123",
    });
    console.log(toJS(memberStore.members));
  };

  const columns: TableColumnsType<MemberModelType> = [
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
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
      ],
    },
    {
      title: "가입일",
      dataIndex: "regiDate",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
      ],
    },
    {
      title: "직업",
      dataIndex: "job",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
      ],
    },
    {
      title: "이메일 수신 동의",
      dataIndex: "isMailAgreed",
      render: (value: boolean) => <Checkbox checked={value} />,
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
      ],
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

  const onChange: TableProps<MemberModelType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const rowSelection: TableProps<MemberModelType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: MemberModelType[]
    ) => {
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
        <AddButton type="primary" onClick={handleAddClick}>
          + 추가
        </AddButton>
      </TitleWrapper>
      <Observer>
        {() => (
          <Table<MemberModelType>
            rowSelection={rowSelection}
            columns={columns}
            dataSource={memberStore.members}
            onChange={onChange}
          />
        )}
      </Observer>
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
