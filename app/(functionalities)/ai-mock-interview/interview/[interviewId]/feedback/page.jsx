"use client"
import db from '@/utils/db'
import { UserAnswerInterview } from '@/utils/schema'
import { desc, eq } from 'drizzle-orm'
import Markdown from 'react-markdown'
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FeedbackPage = ({ params }) => {

    const [feedback, setFeedback] = useState([]);
    const interviewId = React.use(params).interviewId;
    const [averageRating, setAverageRating] = useState(0); // State for average rating

    console.log(interviewId)


    useEffect(() => {
        GetFeedback();
    }, [])

    const GetFeedback = async () => {
        const results = await db.select()
            .from(UserAnswerInterview)
            .where(eq(UserAnswerInterview.mockIdRef, interviewId))
            .orderBy(desc(UserAnswerInterview.id));
        if (results) {
            setFeedback(results);
            console.log(results);
            calculateAverageRating(results); // Call to calculate average rating
        }
    }

    // Function to calculate the average rating
    const calculateAverageRating = (feedbackData) => {
        const totalRating = feedbackData.reduce((sum, data) => sum + parseInt(data.rating, 10), 0);
        const average = totalRating / feedbackData.length;
        setAverageRating(average.toFixed(1)); // Set the average rating with one decimal place
    };


    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-4">Feedback</h1>
            <p className="text-lg text-center text-gray-600 mb-6">
                🎉 Congrats! You have completed your interview successfully.
            </p>

            {/* Display the average rating */}
            <div className="text-center mb-6">
                <span className="text-xl font-semibold">Overall Interview Rating: </span>
                <span className="text-2xl text-green-600">{averageRating} / 10</span>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
                {feedback.map((data, index) => (
                    <AccordionItem
                        key={index}
                        value={`question-${index}`}
                        className="border rounded-lg p-4"
                    >
                        {/* Question */}
                        <AccordionTrigger className="text-lg font-semibold">
                            {data.question}
                        </AccordionTrigger>
                        {/* Answer and Feedback */}
                        <AccordionContent>
                            <div className="p-4 space-y-2 rounded-lg">
                                {/* User Answer */}
                                <div className="mb-4">
                                    <span className="font-semibold text-blue-600">Your Answer:</span>
                                    <p className="text-blue-800 bg-blue-50 p-2 rounded-md"><Markdown>{data.userAns}</Markdown></p>
                                </div>

                                {/* Feedback */}
                                <div className="mb-4">
                                    <span className="font-semibold text-green-600">Feedback:</span>
                                    <p className="text-green-800 bg-green-50 p-2 rounded-md"><Markdown>{data.feedback}</Markdown></p>
                                </div>

                                {/* Favorable Answer */}
                                <div className="mb-4">
                                    <span className="font-semibold text-purple-600">Sample Answer:</span>
                                    <p className="text-purple-800 bg-purple-50 p-2 rounded-md"><Markdown>{data.correctAns}</Markdown></p>
                                </div>

                                {/* Rating */}
                                <div>
                                    <span className="font-semibold text-yellow-600">Rating:</span>
                                    <p className="text-yellow-800 bg-yellow-50 p-2 rounded-md">{data.rating} / 10</p>
                                </div>

                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default FeedbackPage