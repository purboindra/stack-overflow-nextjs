import { getTopInteractedTag } from "@/lib/actions/tag.action";
import Link from "next/link";
import React from "react";
import UserCardContent from "../shared/UserCardContent";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTag({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <UserCardContent user={user} interactedTags={interactedTags} />
    </Link>
  );
};

export default UserCard;
