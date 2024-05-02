"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { ProfileSchema } from "../validation";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Filter } from "mongodb";

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userParam: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userParam);

    console.log({ newUser });

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteuser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) throw new Error("User not found");

    const userQuestionsIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    console.log(userQuestionsIds);

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 2 } = params;
    const query: FilterQuery<typeof User> = {};

    const skipAmount = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
          username: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;

      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUser = await User.countDocuments(query);

    const isNext = totalUser > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            saved: questionId,
          },
        },
        {
          new: true,
        }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            saved: questionId,
          },
        },
        {
          new: true,
        }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "olders":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        match: query,
        options: {
          sort: sortOptions,
          skip: skipAmount,
          limit: pageSize + 1,
        },
        populate: [
          {
            path: "tags",
            model: Tag,
            select: "_id name",
          },
          {
            path: "author",
            model: User,
            select: "_id clerkId name picture",
          },
        ],
      })
      .skip(skipAmount)
      .limit(pageSize);

    if (!user) throw new Error("User not found");

    const savedQuestion = user.saved;

    const isNext = savedQuestion.length > pageSize;

    return {
      questions: savedQuestion,
      isNext,
    };
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function getUseInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return {
      totalQuestions,
      questions: userQuestions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswer = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    return {
      totalAnswers,
      answers: userAnswer,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

type updatedParams = {
  clerkId: string;
  path: string;
};

export async function updatedUser(
  params: updatedParams,
  prevState: any,
  formData: FormData
) {
  try {
    connectToDatabase();

    const validatedFields = ProfileSchema.safeParse({
      name: formData.get("name"),
      username: formData.get("username"),
      portfoliowebsite: formData.get("portfoliowebsite"),
      location: formData.get("location"),
      bio: formData.get("bio"),
    });

    if (!validatedFields.success) {
      console.log("TIDAK VALID");
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { clerkId, path } = params;

    console.log(clerkId);
    console.log(validatedFields.data);

    await User.findOneAndUpdate({ clerkId }, validatedFields.data, {
      new: true,
    });

    revalidatePath(path);
    redirect(`/profile/${clerkId}`);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { message: "Failed to update user" };
    }
    throw error;
  }
}
