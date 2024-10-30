'use client'
const QuizInfoCard = ({ result, onClick }) => {
  return (
    <div
      onClick={() => onClick(result.quiz_id)}  
      className="bg-white rounded-xl shadow-md overflow-hidden p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
          {/* SVG icon */}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 ml-3">
          {result.quiz_name}
        </h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center bg-green-100 text-green-600 rounded-lg px-4 py-2">
          <span className="font-medium">Created Date:</span>
          <span className="ml-auto text-sm">{result.created_date}</span>
        </div>
        <div className="flex items-center bg-red-100 text-red-600 rounded-lg px-4 py-2">
          <span className="font-medium">Due Date:</span>
          <span className="ml-auto text-sm">{result.due_date}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizInfoCard;
