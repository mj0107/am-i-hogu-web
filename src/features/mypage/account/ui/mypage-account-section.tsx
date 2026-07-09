"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogoutMutation } from "@/features/auth/api";
import { MYPAGE_ACCOUNT_ACTIONS, type MypageAccountModalId } from "@/features/mypage/account/constants";
import { useDeleteUserMutation } from "@/features/mypage/api";
import { MenuList } from "@/shared/ui";
import { UserDeleteModal } from "../../withdrawal/ui/user-delete-modal";
import { MypageAccountTermsModal } from "./mypage-account-terms-modal";
import { MypageAppVersionModal } from "./mypage-app-version-modal";
import { MypageLogoutConfirmModal } from "./mypage-logout-confirm-modal";

export function MypageAccountSection() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeModalId, setActiveModalId] = useState<MypageAccountModalId | null>(null);

  const closeAccountModal = () => setActiveModalId(null);
  const goHome = () => router.replace("/");

  return (
    <>
      <section className="flex flex-1 flex-col justify-between" aria-labelledby="mypage-account-heading">
        <h2 id="mypage-account-heading" className="sr-only">
          계정 관리 메뉴
        </h2>
        <MenuList
          items={MYPAGE_ACCOUNT_ACTIONS}
          ariaLabel="계정 관리 메뉴"
          variant="plain"
          onItemSelect={(action) => setActiveModalId(action.modalId)}
        />
        <button
          type="button"
          className="w-fit text-caption-m text-text-02 underline"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          탈퇴하기
        </button>
      </section>

      <MypageAccountTermsModal open={activeModalId === "terms"} onClose={closeAccountModal} />
      <MypageAppVersionModal open={activeModalId === "version"} onClose={closeAccountModal} />
      <MypageLogoutConfirmModal
        open={activeModalId === "logout"}
        onClose={closeAccountModal}
        isPending={logoutMutation.isPending}
        onConfirmLogout={async () => {
          await logoutMutation.mutateAsync();
          closeAccountModal();
          goHome();
        }}
      />
      <UserDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={async () => {
          await deleteUserMutation.mutateAsync();
          return true;
        }}
        onCompleteClose={goHome}
      />
    </>
  );
}
