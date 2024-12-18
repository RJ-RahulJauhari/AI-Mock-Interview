"use client"
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Volume2 } from "lucide-react";
import { useEffect } from "react";

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex, questionStatusUtility }) => {


  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry your browser does not support text to speech....")
    }

  }
  const getBadgeVariant = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-700 bg-green-100 border-green-400';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-400';
      case 'hard':
        return 'text-red-700 bg-red-100 border-red-400';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-400';
    }
  };


  useEffect(() => {
    console.log(`CURRENT QUESTION ${activeQuestionIndex + 1}: `, mockInterviewQuestion[activeQuestionIndex]);
  }, [activeQuestionIndex])

  const { QuestionStatusMap, setQuestionStatusMap } = questionStatusUtility;


  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {mockInterviewQuestion && mockInterviewQuestion.length > 0 ? (
          mockInterviewQuestion.map((question, index) => (
            <h2
              onClick={() => setActiveQuestionIndex(index)}
              key={index}
              className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index
                ? QuestionStatusMap.get(activeQuestionIndex)
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                : ""
                }`}
            >
              Question {index + 1}
            </h2>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>
      <div className="flex w-full justify-end gap-2">
        <Badge variant="outline">{mockInterviewQuestion[activeQuestionIndex]?.category}</Badge>
        <Badge
          className={`${getBadgeVariant(mockInterviewQuestion[activeQuestionIndex]?.difficulty)}`}
          variant="outline"
        >
          {mockInterviewQuestion[activeQuestionIndex]?.difficulty}
        </Badge>
      </div>
      <h2 className="text-lg my-5">{mockInterviewQuestion[activeQuestionIndex]?.questionText}</h2>
      <Volume2 className="my-7 mx-2" onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.questionText)}></Volume2>
      <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {/* Lightbulb Icon */}
        <Lightbulb className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" />

        {/* Heading */}
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Note
        </h5>

        {/* Instruction */}
        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
          Press the <strong>Record</strong> button to record your response for the question. At the end of the interview we will give you feedback of each question along with a possible answer of each question.
        </p>

      </div>


    </div>

  );
};

export default QuestionsSection;
