import { Table, Dropdown, Checkbox, Menu } from "antd";
import { useCoreStore } from "../CoreProvider";
import { MoreOutlined } from "@ant-design/icons";
import { styled } from "styled-components";
import { FieldModel, RecordModel } from "../models";
import { Observer } from "mobx-react";
import { toJS } from "mobx";
import { useState } from "react";
import { FilterDropdownProps } from "antd/es/table/interface";

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
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

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

  const handleFilterChange = (fieldId: string, value: any) => {
    const newFilters = { ...filters };

    if (newFilters[fieldId]?.includes(value)) {
      newFilters[fieldId] = newFilters[fieldId].filter((x: any) => x !== value);
      if (newFilters[fieldId].length === 0) {
        delete newFilters[fieldId];
      }
    } else {
      newFilters[fieldId] = [...(newFilters[fieldId] || []), value];
    }

    setFilters(newFilters);
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

            filterDropdown: ({
              setSelectedKeys,
              confirm,
            }: FilterDropdownProps) => {
              return (
                <FilterContainer>
                  <Menu
                    items={filterOptions.map((option) => ({
                      key: String(option.value),
                      label: (
                        <Checkbox
                          checked={filters[field.id]?.includes(option.value)}
                          onChange={() => {
                            handleFilterChange(field.id, option.value);
                            setSelectedKeys(
                              filters[field.id]?.includes(option.value)
                                ? filters[field.id].filter(
                                    (x: any) => x !== option.value
                                  )
                                : [...(filters[field.id] || []), option.value]
                            );
                            confirm();
                          }}
                        >
                          {option.text}
                        </Checkbox>
                      ),
                    }))}
                  />
                </FilterContainer>
              );
            },
            onFilter: (value, record: RecordModel) => {
              const fieldValue = record[field.id as keyof RecordModel];

              if (typeof fieldValue === "boolean") {
                return fieldValue === (value === "true");
              }

              return String(fieldValue).includes(String(value));
            },
          };

          if (field.id === "isMailAgreed") {
            column.render = (value: boolean) => <Checkbox checked={value} />;
            column.filterDropdown = ({
              setSelectedKeys,
              confirm,
            }: FilterDropdownProps) => {
              return (
                <FilterContainer>
                  <Menu
                    items={[
                      {
                        key: "true",
                        label: (
                          <Checkbox
                            checked={filters[field.id]?.includes("true")}
                            onChange={() => {
                              handleFilterChange(field.id, "true");
                              setSelectedKeys(
                                filters[field.id]?.includes("true")
                                  ? filters[field.id].filter(
                                      (x: any) => x !== "true"
                                    )
                                  : [...(filters[field.id] || []), "true"]
                              );
                              confirm();
                            }}
                          >
                            선택됨
                          </Checkbox>
                        ),
                      },
                      {
                        key: "false",
                        label: (
                          <Checkbox
                            checked={filters[field.id]?.includes("false")}
                            onChange={() => {
                              handleFilterChange(field.id, "false");
                              setSelectedKeys(
                                filters[field.id]?.includes("false")
                                  ? filters[field.id].filter(
                                      (x: any) => x !== "false"
                                    )
                                  : [...(filters[field.id] || []), "false"]
                              );
                              confirm();
                            }}
                          >
                            선택 안함
                          </Checkbox>
                        ),
                      },
                    ]}
                  />
                </FilterContainer>
              );
            };
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
                    label: <span style={{ color: "#FF4D4F" }}>삭제</span>,
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

        const filteredData = dataSource.filter((record) => {
          for (const fieldId in filters) {
            if (filters[fieldId] && filters[fieldId].length > 0) {
              const fieldValue = record[fieldId as keyof RecordModel];

              const matches = filters[fieldId].some((filterValue: any) => {
                if (typeof fieldValue === "boolean") {
                  return fieldValue === (filterValue === "true");
                }
                return String(fieldValue).includes(String(filterValue));
              });

              if (!matches) return false;
            }
          }
          return true;
        });

        return (
          <StyledTable
            columns={columns}
            dataSource={filteredData}
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
    color: #739fff;
  }
`;

const FilterContainer = styled.div`
  padding: 8px;
  min-width: 150px;
  > ul {
    gap: 8px;
    display: flex;
    flex-direction: column;
  }
`;

const StyledTable = styled(Table<RecordModel>)`
  tr > td:nth-child(1) {
    border-right: 1px solid;
    border-color: #f0f0f0;
  }
`;
