import { auth } from "@clerk/nextjs/server";
import React from "react";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import Profile from "@/components/forms/Profile";

export const dynamic = "force-dynamic";

export default async function page({ params }: ParamsProps) {
  const { userId } = await auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
}
