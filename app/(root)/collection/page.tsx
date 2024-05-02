import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/contants/filter";
import { getSavedQuestion } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";

export default async function Colletion({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  if (!userId) return null;

  const result = await getSavedQuestion({
    clerkId: userId!,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Question</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex "
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id.toString()}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvote={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            );
          })
        ) : (
          <NoResult
            title="There is no question save to show"
            description="Be the first to break the silence! Ask a Question and kickstart the
          discussion. Our query could be the next big thing others learn from. Get
          involved!"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      {result.questions.length > 0 && (
        <div className="mt-12">
          <Pagination pageNumber={1} isNext={result.isNext} />
        </div>
      )}
    </>
  );
}
