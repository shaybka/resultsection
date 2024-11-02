'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const QuizDetail = ({ params }) => {
    const [quiz, setQuiz] = useState(null);
    const [filter, setFilter] = useState("");
    const [sortAscending, setSortAscending] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/result/${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch quiz data");

                const data = await response.json();
                setQuiz(data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setQuiz({ error: "Failed to load quiz data" });
            }
        };

        fetchQuiz();
    }, [params.id]);

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStudent(null);
    };

    const updateCorrectness = (questionId, isCorrect) => {
        setSelectedStudent((prevStudent) => ({
            ...prevStudent,
            answers: prevStudent.answers.map((answer) =>
                answer.question_id === questionId ? { ...answer, is_correct: isCorrect } : answer
            ),
        }));
    };

    const handleUpdate = async () => {
        if (!selectedStudent) return;
    
        try {
            const totalQuestions = selectedStudent.answers.length;
            const correctAnswers = selectedStudent.answers.filter(answer => answer.is_correct).length;
            const updatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    
            const updatedStudentData = {
                answers: selectedStudent.answers,
                score: updatedScore
            };
    
            console.log("Sending updated student data:", JSON.stringify(updatedStudentData, null, 2));
    
            const response = await fetch(`http://localhost:3000/api/update-answers/${selectedStudent.student_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedStudentData),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to update answers. API Response:", errorText);
                throw new Error("Failed to update answers");
            }
    
            const updatedStudent = await response.json();
            console.log("Received updated student data:", updatedStudent);
    
            // Update the quiz state with the new student data
            setQuiz((prevQuiz) => ({
                ...prevQuiz,
                students: prevQuiz.students.map((student) =>
                    student.student_id === updatedStudent.student_id ? updatedStudent : student
                ),
            }));
    
            // Re-fetch quiz data to get the latest information
            const fetchUpdatedQuiz = async () => {
                try {
                    const updatedResponse = await fetch(`http://localhost:3000/api/result/${params.id}`);
                    if (!updatedResponse.ok) throw new Error("Failed to fetch updated quiz data");
    
                    const updatedData = await updatedResponse.json();
                    setQuiz(updatedData);
                } catch (error) {
                    console.error("Error fetching updated quiz:", error);
                }
            };
    
            await fetchUpdatedQuiz();  
    
            closeModal();
            
        } catch (error) {
            console.error("Error updating answers:", error);
        }
    };
    

    

    if (!quiz) return <div>Loading...</div>;
    if (quiz.error) return <div>{quiz.error}</div>;

    const filteredStudents = quiz.students
        .filter((student) =>
            student.student_name.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => sortAscending ? (a.status === "taken" ? -1 : 1) : (a.status === "taken" ? 1 : -1));

    return (
        <div className="container mx-auto p-6">
            <div className="bg-green-500 p-6 rounded-t-lg text-white flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{quiz.quiz_name}</h1>
                    <p className="text-sm">
                        Created Date: {quiz.created_date} &nbsp; • Due Date: {quiz.due_date}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-b-lg shadow-lg -mt-6 relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="sort" className="text-gray-700">
                            Sort by:
                        </label>
                        <select
                            id="sort"
                            className="border border-gray-300 rounded-md px-3 py-2"
                            onChange={() => setSortAscending(!sortAscending)}
                        >
                            <option value="taken">Taken</option>
                            <option value="not-taken">Not Taken</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 rounded-lg p-2"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Student Name</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.student_id}
                                        className={`hover:bg-gray-50 border-b border-gray-100 ${
                                            student.status === "taken" ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                                        }`}
                                        onClick={() => student.status === "taken" && handleStudentClick(student)}
                                    >
                                        <td className="py-3 px-6">{student.student_name}</td>
                                        <td className="py-3 px-6 font-semibold">
                                            <span className={student.status === "taken" ? "text-green-600" : "text-red-600"}>
                                                {student.status === "taken" ? "Taken" : "Not Taken"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6">
                                            {student.status === "taken" ? `${student.score}%` : "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedStudent && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl md:w-3/4 max-h-[90vh] overflow-y-auto z-60">
                        <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                {selectedStudent.student_name}'s Quiz Details
                            </h2>
                            <button onClick={closeModal} className="text-white">
                                &times;
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedStudent.answers.map((answer) => (
                                <div key={answer.question_id} className="border border-gray-200 p-4 rounded-lg">
                                    <p className="font-semibold text-gray-700">
                                        Question: <span className="font-normal">{answer.question_text}</span>
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        <strong>Your Answer:</strong> {answer.student_answer}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Correct Answer:</strong> {answer.correct_answer}
                                    </p>
                                    <div className="mt-3 flex items-center">
                                        <label htmlFor={`correctness-${answer.question_id}`} className="mr-2 text-gray-700 font-medium">
                                            Correct?
                                        </label>
                                        <select
                                            id={`correctness-${answer.question_id}`}
                                            value={answer.is_correct ? "true" : "false"}
                                            onChange={(e) => updateCorrectness(answer.question_id, e.target.value === "true")}
                                            className="border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="true">Correct</option>
                                            <option value="false">Wrong</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-gray-100 flex justify-end">
                            <button onClick={handleUpdate} className="bg-green-500 text-white px-6 py-2 rounded-md">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizDetail;
