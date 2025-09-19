import React from "react";

interface Props {
  errorOutput: string; // your error string from server
}

const ErrorDisplay: React.FC<Props> = ({ errorOutput }) => {
  return (
    <div className="p-3 rounded">
      {errorOutput.split("\n").map((line, idx) => (
        <p key={idx} className="text-red-600 font-mono">
          {line}
        </p>
      ))}
    </div>
  );
};

export default ErrorDisplay;
