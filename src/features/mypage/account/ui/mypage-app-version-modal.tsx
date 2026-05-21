import {
  Modal,
  ModalActionButton,
  ModalActions,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/shared/ui";

type MypageAppVersionModalProps = {
  open: boolean;
  onClose: () => void;
  version?: string;
};

export function MypageAppVersionModal({ open, onClose, version = "v.0.1" }: MypageAppVersionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-filter-bg px-common-padding">
      <Modal padding="md">
        <ModalHeader>
          <ModalTitle>앱 버전</ModalTitle>
          <ModalDescription className="whitespace-pre-line">{`${version}\n\n업데이트 노트 확인하기`}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalActions primary={<ModalActionButton onClick={onClose}>확인</ModalActionButton>} />
        </ModalFooter>
      </Modal>
    </div>
  );
}
