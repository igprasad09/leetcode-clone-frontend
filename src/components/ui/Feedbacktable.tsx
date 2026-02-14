"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [direction, setDirection] = useState(0);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-6 text-center"
      >
        User Feedback
      </motion.h2>

      {/* Feedback Cards */}
      <div className="relative overflow-hidden min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {currentFeedbacks.map((fb, index) => (
              <motion.div
                key={fb.email}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="bg-neutral-800 shadow-md rounded-lg p-4 border border-neutral-700"
              >
                <p className="text-sm text-gray-300 font-bold">{fb.email}</p>
                <p className="mt-2 text-gray-100">{fb.feedback}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 rounded disabled:opacity-50"
        >
          Prev
        </motion.button>

        <p className="font-medium">
          Page {currentPage} of {totalPages}
        </p>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-900 rounded disabled:opacity-50"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

export default FeedbackList;
