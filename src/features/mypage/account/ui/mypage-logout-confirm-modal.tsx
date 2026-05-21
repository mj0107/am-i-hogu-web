import {
  Modal,
  ModalActionButton,
  ModalActions,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/shared/ui";

type MypageLogoutConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
};

export function MypageLogoutConfirmModal({ open, onClose, onConfirmLogout }: MypageLogoutConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-filter-bg px-common-padding">
      <Modal padding="md">
        <ModalHeader>
          <ModalTitle>로그아웃</ModalTitle>
          <ModalDescription>로그아웃 하시겠습니까?</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalActions
            layout="double"
            secondary={
              <ModalActionButton variant="inactive" onClick={onClose}>
                취소하기
              </ModalActionButton>
            }
            primary={<ModalActionButton onClick={onConfirmLogout}>로그아웃</ModalActionButton>}
          />
        </ModalFooter>
      </Modal>
    </div>
  );
}
