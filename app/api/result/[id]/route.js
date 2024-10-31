import { readData } from "@/helper/utils"; 
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;  

  try {
    const data = await readData();

    // Flatten the quizzes and find the matching quiz directly
    const quizzes = data.courses.flatMap(course => course.quizzes);
    const foundQuiz = quizzes.find(quiz => quiz.quiz_id === id);

    // Check if a quiz was found
    if (!foundQuiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    // Return the found quiz
    return NextResponse.json(foundQuiz, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};