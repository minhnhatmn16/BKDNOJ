import { useState } from "react";
import { useParams } from "react-router-dom";

const SubmitForm = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState("C++17");
  const [code, setCode] = useState("// Write your code here");

  const handleSubmit = () => {
    console.log("Submit:", { id, language, code });
  };

  return (
    <div className="one-column-wrapper p-4">
      <div className="rounded-md border border-gray-300 shadow-md">
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 p-3">
          <h2 className="text-lg font-semibold">Submit ⚡</h2>
          <span className="text-gray-500">Problem ID: {id}</span>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="mb-1 block font-medium">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1"
            >
              <option value="C">C</option>
              <option value="C++17">C++17</option>
              <option value="C++20">C++20</option>
              <option value="Python 3">Python 3</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Code:</label>
            <textarea
              rows={15}
              className="w-full rounded border border-gray-300 p-2 font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="rounded bg-primary px-4 py-2 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
          <div className="mt-4 text-sm italic text-gray-500">
            ⚠ This editor only stores your most recent code!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
