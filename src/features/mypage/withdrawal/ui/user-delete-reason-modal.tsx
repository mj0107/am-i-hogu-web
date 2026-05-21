"use client";

import { type ReactNode, useEffect, useState } from "react";

import { USER_DELETE_MODAL_COPY, USER_DELETE_REASONS } from "@/features/mypage/withdrawal/constants";
import {
  Input,
  Modal,
  ModalActionButton,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  RadioOption,
} from "@/shared/ui";

export type UserDeleteReason = (typeof USER_DELETE_REASONS)[number]["value"];

export type UserDeleteSubmitPayload = {
  reason: UserDeleteReason;
  reasonLabel: string;
  detail?: string;
};

export type UserDeleteReasonModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: (payload: UserDeleteSubmitPayload) => void;
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  reasonPlaceholder?: string;
  initialReason?: UserDeleteReason | null;
  initialReasonDetail?: string;
  className?: string;
};

export function UserDeleteReasonModal(props: UserDeleteReasonModalProps) {
  const {
    open,
    onClose,
    onConfirmDelete,
    title = USER_DELETE_MODAL_COPY.reasonTitle,
    description = USER_DELETE_MODAL_COPY.reasonDescription,
    confirmText = USER_DELETE_MODAL_COPY.reasonConfirmText,
    reasonPlaceholder = USER_DELETE_MODAL_COPY.reasonPlaceholder,
    initialReason = null,
    initialReasonDetail = "",
    className,
  } = props;

  const [selectedReason, setSelectedReason] = useState<UserDeleteReason | null>(initialReason);
  const [reasonDetail, setReasonDetail] = useState(initialReasonDetail);

  useEffect(() => {
    if (!open) return;
    setSelectedReason(initialReason);
    setReasonDetail(initialReasonDetail);
  }, [initialReason, initialReasonDetail, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleReasonSubmit = () => {
    if (!selectedReason) return;

    const selectedReasonItem = USER_DELETE_REASONS.find((reason) => reason.value === selectedReason);
    if (!selectedReasonItem) return;

    onConfirmDelete({
      reason: selectedReason,
      reasonLabel: selectedReasonItem.label,
      detail: selectedReason === "other" ? reasonDetail.trim() : undefined,
    });
  };

  const isReasonSubmitDisabled = !selectedReason || (selectedReason === "other" && reasonDetail.trim().length === 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-filter-bg">
      <Modal padding="md" className={className}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
          <ul className="flex w-full flex-col gap-2 pl-2 pt-1">
            {USER_DELETE_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.value;

              return (
                <li key={reason.value} className="w-full">
                  <RadioOption
                    checked={isSelected}
                    label={reason.label}
                    onClick={() => setSelectedReason(reason.value)}
                  />
                  {reason.value === "other" && selectedReason === "other" ? (
                    <Input
                      type="text"
                      value={reasonDetail}
                      onChange={(event) => setReasonDetail(event.target.value)}
                      placeholder={reasonPlaceholder}
                      className="mt-2"
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </ModalHeader>
        <ModalFooter>
          <ModalActionButton
            variant={isReasonSubmitDisabled ? "disabled" : "primary"}
            onClick={handleReasonSubmit}
            disabled={isReasonSubmitDisabled}
          >
            {confirmText}
          </ModalActionButton>
        </ModalFooter>
      </Modal>
    </div>
  );
}
