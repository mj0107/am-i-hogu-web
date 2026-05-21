import { MYPAGE_ACCOUNT_TERMS_DESCRIPTION } from "@/features/mypage/account/constants";
import {
  Modal,
  ModalActionButton,
  ModalActions,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/shared/ui";

type MypageAccountTermsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function MypageAccountTermsModal({ open, onClose }: MypageAccountTermsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-filter-bg px-common-padding">
      <Modal padding="md" className="max-h-[500px]">
        <ModalHeader>
          <ModalTitle>약관 및 개인정보 처리 방침</ModalTitle>
        </ModalHeader>
        <ModalBody className="min-h-0 overflow-y-auto">
          <ModalDescription className="whitespace-pre-line text-body-m">
            {MYPAGE_ACCOUNT_TERMS_DESCRIPTION}
          </ModalDescription>
        </ModalBody>
        <ModalFooter>
          <ModalActions primary={<ModalActionButton onClick={onClose}>확인</ModalActionButton>} />
        </ModalFooter>
      </Modal>
    </div>
  );
}
