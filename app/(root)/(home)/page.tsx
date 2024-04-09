import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/contants/filter";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "What is the best programming language for web development?",
    tags: [
      {
        _id: "1",
        name: "python",
      },
      {
        _id: "2",
        name: "javascript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "",
    },
    upvote: 1000000,
    views: 100,
    answer: [],
    creatdAt: new Date("2023-01-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "What is the best programming language for mobile development?",
    tags: [
      {
        _id: "1",
        name: "flutter",
      },
      {
        _id: "2",
        name: "javascript",
      },
    ],
    author: {
      _id: "2",
      name: "John Doe",
      picture: "",
    },
    upvote: 1532300,
    views: 90,
    answer: [],
    creatdAt: new Date("2022-03-01T12:00:00.000Z"),
  },
  {
    _id: "3",
    title: "What is the best programming language for backend development?",
    tags: [
      {
        _id: "1",
        name: "go",
      },
      {
        _id: "2",
        name: "php",
      },
    ],
    author: {
      _id: "3",
      name: "John Doe",
      picture: "",
    },
    upvote: 13,
    views: 85,
    answer: [],
    creatdAt: new Date("2024-01-01T12:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[40px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex "
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id.toString()}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvote={question.upvote}
              views={question.views}
              answers={question.answer}
              createdAt={question.creatdAt}
            />
          ))
        ) : (
          <NoResult
            title="There is no question to show"
            description="Be the first to break the silence! Ask a Question and kickstart the
          discussion. Our query could be the next big thing others learn from. Get
          involved!"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
