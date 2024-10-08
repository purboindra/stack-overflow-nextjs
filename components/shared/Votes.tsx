"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { VotesEnum, formatAndDividedNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  type: VotesEnum;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  hasDownVoted,
  downvotes,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId: userId || undefined,
    });
  }, [itemId, userId, pathname, router]);

  const handleSave = async () => {
    await toggleSaveQuestion({
      path: pathname,
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }

    try {
      if (action === "upvote") {
        if (type === VotesEnum.QUESTION) {
          await upvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
          });
        } else if (type === VotesEnum.ANSWER) {
          await upvoteAnswer({
            answerId: itemId,
            userId,
            path: pathname,
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
          });
        }
        return;
      }

      if (action === "downvote") {
        if (type === VotesEnum.QUESTION) {
          await downvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
          });
        } else if (type === VotesEnum.ANSWER) {
          await downvoteAnswer({
            answerId: itemId,
            userId,
            path: pathname,
            hasdownVoted: hasDownVoted,
            hasupVoted: hasUpVoted,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={async () => await handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDividedNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={async () => await handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDividedNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === VotesEnum.QUESTION && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;
