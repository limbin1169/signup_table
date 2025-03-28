import { Modal } from "antd";
import { useCoreStore } from "../CoreProvider";
import { Observer } from "mobx-react";
import styled from "styled-components";

interface RecordModalProps {
  open: boolean;
  onClose: () => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({ open, onClose }) => {
  const { uiStore } = useCoreStore();

  const handleOk = () => {
    uiStore.setIsModalOpen(false);
  };

  return (
    <Observer>
      {() => (
        <StyledModal
          title="회원 추가"
          open={open}
          onOk={handleOk}
          width={520}
          onCancel={onClose}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
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
