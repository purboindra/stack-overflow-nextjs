import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({ userId, page: 1 });

  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          author={answer.author}
          clerkId={clerkId}
          question={answer.question}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswersTab;
