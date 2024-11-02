import { readData, saveData } from '@/helper/utils';
import { NextResponse } from 'next/server';

export const PUT = async (request, { params }) => {
  const { student_id } = params;
  let updatedData;

  try {
    updatedData = await request.json();
  } catch (error) {
    console.error("Error parsing JSON from request:", error);
    return NextResponse.json(
      { message: "Invalid JSON format." },
      { status: 400 }
    );
  }

  // Log the incoming data to verify structure
  console.log("Received student_id:", student_id);
  console.log("Received updatedData:", updatedData);

  // Validate the structure of updatedData
  if (
    !updatedData ||
    typeof updatedData !== "object" ||
    !Array.isArray(updatedData.answers) ||
    typeof updatedData.score !== "number"
  ) {
    console.error("Invalid data format:", updatedData);
    return NextResponse.json(
      { message: "Invalid data format. Expected an object with 'answers' array and 'score' number." },
      { status: 400 }
    );
  }

  try {
    console.log("Attempting to read existing data...");
    const data = await readData();

    // Log the data structure received from readData to verify it's correct
    console.log("Data structure received from readData:", data);

    let studentFound = false;

    // Navigate through courses and quizzes to find the student
    for (const course of data.courses) {
      for (const quiz of course.quizzes) {
        const studentIndex = quiz.students.findIndex(student => student.student_id === student_id);
        if (studentIndex !== -1) {
          // Update the student data
          quiz.students[studentIndex] = {
            ...quiz.students[studentIndex],
            ...updatedData
          };

          // Log the updated student data to verify the changes
          console.log("Updated student data:", quiz.students[studentIndex]);

          studentFound = true;
          break;
        }
      }
      if (studentFound) break;
    }

    if (!studentFound) {
      console.error("Student not found:", student_id);
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    // Save the updated data
    console.log("Attempting to save updated data...");
    await saveData(data);
    console.log("Data saved successfully.");

    return NextResponse.json(
      { message: "Student data updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student data:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
};