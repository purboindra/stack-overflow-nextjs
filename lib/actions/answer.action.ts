"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    console.log({ newAnswer });

    // const questionById = await Question.findById(question);
    // questionById.answers = questionById.answers.concat(newAnswer);
    // await questionById.save();

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
