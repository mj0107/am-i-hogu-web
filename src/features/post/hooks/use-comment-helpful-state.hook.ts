"use client";

import { useEffect, useState } from "react";
import type { CommentHelpfulResponse, CommentItemResponse } from "@/shared/api/generated";

type HelpfulState = {
  active: boolean;
  count: number;
};

type UseCommentHelpfulStateParams = {
  comment: CommentItemResponse;
  replies: CommentItemResponse[];
  onToggleHelpful: (comment: CommentItemResponse) => Promise<CommentHelpfulResponse>;
};

/**
 * 댓글과 답글의 유익해요 표시 상태와 토글 중복 호출 방지를 관리하는 훅
 *
 * @description
 * 서버에서 다시 내려온 댓글 응답을 기준으로 유익해요 선택 여부와 개수를 동기화합니다.
 * 원댓글과 답글의 토글 흐름은 같지만, 답글은 여러 개라 `commentId`를 key로 상태를 관리합니다.
 * API 호출은 사용자가 유익해요 버튼을 누른 시점에만 실행하고, pending 중에는 같은 카드의 중복 호출을 막습니다.
 *
 * @param params.comment - 현재 렌더링 중인 원댓글입니다.
 * @param params.replies - 원댓글에 연결된 답글 목록입니다.
 * @param params.onToggleHelpful - 유익해요 등록/취소 API 호출 핸들러입니다.
 *
 * @returns commentHelpful - 원댓글의 유익해요 선택 여부와 개수입니다.
 * @returns isCommentHelpfulPending - 원댓글 유익해요 토글 요청 진행 여부입니다.
 * @returns pendingReplyHelpfulId - 유익해요 토글 요청 중인 답글 ID입니다.
 * @returns replyHelpfulMap - 답글별 유익해요 선택 여부와 개수입니다.
 * @returns toggleCommentHelpful - 원댓글 유익해요 토글 핸들러입니다.
 * @returns toggleReplyHelpful - 답글 유익해요 토글 핸들러입니다.
 */
export function useCommentHelpfulState(params: UseCommentHelpfulStateParams) {
  const { comment, replies, onToggleHelpful } = params;
  const [commentHelpful, setCommentHelpful] = useState<HelpfulState>({
    active: comment.isHelpful,
    count: comment.totalHelpfulCount,
  });
  const [isCommentHelpfulPending, setIsCommentHelpfulPending] = useState(false);
  const [replyHelpfulMap, setReplyHelpfulMap] = useState<Record<string, HelpfulState>>({});
  const [pendingReplyHelpfulId, setPendingReplyHelpfulId] = useState<string | number | null>(null);

  useEffect(() => {
    setCommentHelpful({
      active: comment.isHelpful,
      count: comment.totalHelpfulCount,
    });
  }, [comment.isHelpful, comment.totalHelpfulCount]);

  useEffect(() => {
    setReplyHelpfulMap(
      Object.fromEntries(
        replies.map((reply) => [String(reply.commentId), { active: reply.isHelpful, count: reply.totalHelpfulCount }]),
      ),
    );
  }, [replies]);

  const toggleCommentHelpful = async () => {
    if (isCommentHelpfulPending) {
      return;
    }

    setIsCommentHelpfulPending(true);
    try {
      const result = await onToggleHelpful({
        ...comment,
        isHelpful: commentHelpful.active,
        totalHelpfulCount: commentHelpful.count,
      });
      setCommentHelpful({
        active: result.isHelpful,
        count: result.totalHelpfulCount,
      });
    } finally {
      setIsCommentHelpfulPending(false);
    }
  };

  const toggleReplyHelpful = async (reply: CommentItemResponse) => {
    if (pendingReplyHelpfulId !== null) {
      return;
    }

    const replyKey = String(reply.commentId);
    const current = replyHelpfulMap[replyKey] ?? {
      active: reply.isHelpful,
      count: reply.totalHelpfulCount,
    };
    setPendingReplyHelpfulId(reply.commentId);
    try {
      const result = await onToggleHelpful({
        ...reply,
        isHelpful: current.active,
        totalHelpfulCount: current.count,
      });
      setReplyHelpfulMap((prev) => ({
        ...prev,
        [replyKey]: {
          active: result.isHelpful,
          count: result.totalHelpfulCount,
        },
      }));
    } finally {
      setPendingReplyHelpfulId(null);
    }
  };

  return {
    commentHelpful,
    isCommentHelpfulPending,
    pendingReplyHelpfulId,
    replyHelpfulMap,
    toggleCommentHelpful,
    toggleReplyHelpful,
  };
}
