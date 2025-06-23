import Header from "../components/Header";
import QuizGenderQuestion from "../components/QuizGenderQuestion";
import { QuizAnswersProvider } from "../context/QuizAnswersContext";

const QuizGender = () => {
  return (
    <div className="min-h-screen bg-flourishwhite flex flex-col font-inter">
      <div className="w-full sticky top-0 z-10">
        <Header withBack questionCount="1 / 22" />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-0">
        <div className="w-full max-w-2xl mx-auto pt-6 flex flex-col items-center">
          <div className="w-full text-base sm:text-lg">
            <QuizGenderQuestion />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizGender;
