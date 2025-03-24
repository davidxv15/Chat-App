import { useState } from "react";

const RecruiterAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="max-w-md w-full mb-6 border border-yellow-500 rounded-2xl bg-gradient-to-br from-stone-600 via-stone-300 to-stone-400 shadow-lg text-black opacity-90 translate-y-4"
      role="alert"
      aria-label="Recruiter quick login info"
    >
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2 pt-1 text-left text-md font-semibold text-gray-800 flex items-center justify-center hover:bg-stone-500 rounded-t-2xl"
        aria-expanded={isOpen}
        aria-controls="recruiter-credentials"
      >
        ⚠️ Quick Access for Recruiters ⚠️
        <span className="justify-end">{isOpen ? "−" : "+"}</span>
      </button>

      {/* Accordion Body */}
      <div
        id="recruiter-credentials"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 p-4" : "max-h-0 p-0"
        }`}
      >
        <p className="text-sm text-gray-800 mb-2">Demo Credentials:</p>
        <div className="flex justify-between gap-4 text-sm font-mono text-gray-900">
          <div className="text-left border border-black p-2 rounded-md w-full">
            <p>
              Username: <code className="text-green-500">demo1</code>
            </p>
            <p>
              Password: <code className="text-green-500">demo1</code>
            </p>
          </div>
          <div className="text-left border border-black p-2 rounded-md w-full">
            <p>
              Username: <code className="text-pink-600">demo2</code>
            </p>
            <p>
              Password: <code className="text-pink-600">demo2</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterAccordion;
