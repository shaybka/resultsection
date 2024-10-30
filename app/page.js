'use client'
import QuizInfoCard from "@/components/QuizInfoCard";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const router = useRouter();  

   
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3000/api/result");
            const data = await response.json();
            const allQuizzes = data.courses.flatMap(course => course.quizzes);
            console.log(allQuizzes);
            setQuizzes(allQuizzes);
        };

        fetchData();
    }, []);

    const handleQuizClick = (quizId) => {
        router.push(`/QuizResult/${quizId}`);  
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {quizzes.map((quiz) => (
                <QuizInfoCard key={quiz.quiz_id} result={quiz} onClick={handleQuizClick} />
                
            ))}
        </div>
    );
};

export default Home;
