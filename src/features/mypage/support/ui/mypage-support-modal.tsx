import QuestionIcon from "@/assets/icons/question.svg";
import {
  Modal,
  ModalActionButton,
  ModalActions,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalIcon,
  ModalTitle,
} from "@/shared/ui";

type MypageSupportModalProps = {
  open: boolean;
  onClose: () => void;
};

export function MypageSupportModal({ open, onClose }: MypageSupportModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-filter-bg px-common-padding">
      <Modal padding="lg">
        <ModalHeader align="center">
          <ModalIcon className="bg-indigo-100">
            <QuestionIcon aria-hidden className="size-8" strokeWidth={20} />
          </ModalIcon>
          <ModalTitle>이용 문의</ModalTitle>
          <ModalDescription className="whitespace-pre-line text-center">
            {"문의 기능은 준비 중입니다."}
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalActions primary={<ModalActionButton onClick={onClose}>확인</ModalActionButton>} />
        </ModalFooter>
      </Modal>
    </div>
  );
}
