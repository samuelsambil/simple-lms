import { Link } from 'react-router-dom';

function Certificate() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-2xl w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          You've completed the course!
        </p>
        <div className="border-4 border-blue-600 rounded-lg p-8 mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Certificate of Completion
          </div>
          <div className="text-gray-600">
            This certifies that you have successfully completed
          </div>
          <div className="text-xl font-bold text-blue-600 my-4">
            Introduction to Python
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <Link
          to="/my-courses"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Back to My Courses
        </Link>
      </div>
    </div>
  );
}

export default Certificate;