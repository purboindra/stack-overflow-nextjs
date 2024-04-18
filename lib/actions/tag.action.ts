"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTag(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found!");

    return [
      {
        name: "tag1",
        _id: 1,
      },
      {
        name: "tag2",
        _id: 2,
      },
      {
        name: "tag3",
        _id: 3,
      },
    ];
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
