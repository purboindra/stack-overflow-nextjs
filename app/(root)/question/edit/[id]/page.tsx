import Question from "@/components/forms/Question";
import { auth } from "@clerk/nextjs";
import React from "react";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";

export default async function page({ params }: ParamsProps) {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={mongoUser._id}
          type="Edit"
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
}
