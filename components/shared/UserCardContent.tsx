"use client";

import { Badge } from "lucide-react";
import React, { useEffect, useState } from "react";
import RenderTag from "./RenderTag";
import Image from "next/image";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
  interactedTags: { name: string; _id: number }[];
}

const UserCardContent = ({ user, interactedTags }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
          <Image
            src={user.picture}
            alt="user profile picture"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              {user.username}
            </p>
          </div>
          <div className="mt-5">
            {interactedTags.length > 0 ? (
              <div className="flex items-center gap-2">
                {interactedTags.map((tag) => (
                  <RenderTag key={tag._id} name={tag.name} _id={tag._id} />
                ))}
              </div>
            ) : (
              <Badge>No tags yet</Badge>
            )}
          </div>
        </article>
      )}
    </>
  );
};

export default UserCardContent;
