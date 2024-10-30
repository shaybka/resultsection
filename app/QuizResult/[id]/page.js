'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const QuizDetail = ({ params }) => {
    const router = useRouter();
    const [quiz, setQuiz] = useState(null);
    const [filter, setFilter] = useState('');
    
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/result/${params.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch quiz data");
                }
                const data = await response.json();
                setQuiz(data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setQuiz({ error: "Failed to load quiz data" });
            }
        };

        fetchQuiz();
    }, [params.id]);

    if (!quiz) return <p className="text-center mt-4">Loading...</p>;
    if (quiz.error) return <p className="text-red-500 text-center mt-4">{quiz.error}</p>;

    const filteredStudents = quiz.students.filter(student =>
        student.student_name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">{quiz.quiz_name}</h1>
            <p className="text-center mb-2">Due Date: {quiz.due_date}</p>
            <p className="text-center mb-4">Total Questions: {quiz.total_questions}</p>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by student name..."
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Student Name</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Status</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.student_id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b border-gray-300">{student.student_name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <span className={`font-semibold ${student.status === "taken" ? "text-green-600" : "text-red-600"}`}>
                                            {student.status === "taken" ? "Taken" : "Not Taken"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        {student.status === "taken" ? student.score + "%" : "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-2 px-4 border-b border-gray-300 text-center">No students found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuizDetail;
