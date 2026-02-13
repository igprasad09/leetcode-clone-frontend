import { useState } from "react";

type Feedback = {
  email: string;
  feedback: string;
};

type Props = {
  feedbacks: Feedback[];
};

const FeedbackList = ({ feedbacks }: Props) => {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        User Feedback
      </h2>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {currentFeedbacks.map((fb) => (
          <div
            key={fb.email}
            className="bg-neutral-800 shadow-md rounded-lg p-4 border"
          >
            <p className="text-sm text-gray-300 font-bold">{fb.email}</p>
            <p className="mt-2 text-gray-100">{fb.feedback}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <p className="font-medium">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-900 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackList;
