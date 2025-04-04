import { Button } from "antd";
import styled from "styled-components";
import { useCoreStore } from "./CoreProvider";
import { Observer } from "mobx-react";
import { RecordModal, RecordTable } from "./components";
import { RecordModel } from "./models";

const App = () => {
  const { recordStore, uiStore } = useCoreStore();

  const handleAddClick = () => {
    uiStore.setCurrentRecord();
    uiStore.setIsModalOpen(true);
  };
  const handleClose = () => {
    uiStore.setIsModalOpen(false);
  };
  const handleEditClick = (record: RecordModel) => {
    uiStore.setCurrentRecord(record);
    uiStore.setIsModalOpen(true);
  };
  // console.log(import.meta.env.VITE_STORAGE);
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
          <RecordTable
            records={recordStore.records}
            fields={recordStore.fields}
            onEdit={handleEditClick}
          />
        )}
      </Observer>

      <Observer>
        {() => (
          <RecordModal
            open={uiStore.isModalOpen}
            onClose={handleClose}
            fields={recordStore.fields}
            initialValues={uiStore.currentRecord}
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
