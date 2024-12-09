"use client"
import { Lightbulb } from "lucide-react";
import { useState } from "react";


const QuestionsSection = ({ mockInterviewQuestion }) => {

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);


  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {mockInterviewQuestion && mockInterviewQuestion.length > 0 ? (
          mockInterviewQuestion.map((question, index) => (
            <h2 key={index} className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'bg-primary text-white'}`}>
              Question {index + 1}:
            </h2>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>
      <h2 className="text-lg my-5">{mockInterviewQuestion[activeQuestionIndex]?.questionText}</h2>

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
