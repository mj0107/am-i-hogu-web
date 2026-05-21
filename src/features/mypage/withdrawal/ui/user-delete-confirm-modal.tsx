import type { ReactNode } from "react";
import {
  Modal,
  ModalActionButton,
  ModalActions,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/shared/ui";

export type UserDeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  className?: string;
};

export function UserDeleteConfirmModal(props: UserDeleteConfirmModalProps) {
  const {
    open,
    onClose,
    onConfirmDelete,
    title = "정말 탈퇴하실 건가요?",
    description = "탈퇴 시 계정은 복구할 수 없습니다.\n게시글과 댓글은 '탈퇴한 사용자'로 표시됩니다.\n\n탈퇴하시겠습니까?",
    confirmText = "탈퇴하기",
    cancelText = "취소하기",
    className,
  } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-filter-bg">
      <Modal padding="md" className={className}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription className="whitespace-pre-line">{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalActions
            layout="double"
            secondary={
              <ModalActionButton variant="inactive" onClick={onClose}>
                {cancelText}
              </ModalActionButton>
            }
            primary={
              <ModalActionButton variant="danger" onClick={onConfirmDelete}>
                {confirmText}
              </ModalActionButton>
            }
          />
        </ModalFooter>
      </Modal>
    </div>
  );
}
