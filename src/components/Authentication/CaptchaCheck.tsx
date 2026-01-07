import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface CaptchaCheckProps {
  onCaptchaValidated: (value: boolean) => void;
}

const getRandomNumber = () => Math.floor(Math.random() * 20) + 1;

const CaptchaCheck: React.FC<CaptchaCheckProps> = ({ onCaptchaValidated }) => {
  const [num1] = useState<number>(getRandomNumber());
  const [num2] = useState<number>(getRandomNumber());
  const [userAnswer, setUserAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaValidated, setCaptchaValidated] = useState(false);

  const correctAnswer = num1 + num2;

  const checkCaptcha = () => {
    if (Number(userAnswer) === correctAnswer) {
      setCaptchaError(false);
      setCaptchaValidated(true);
      onCaptchaValidated(true);
    } else {
      setCaptchaError(true);
      onCaptchaValidated(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <label
        htmlFor="captcha-answer"
        className="block text-lg font-semibold text-gray-900 mb-2"
      >
        What is {num1} + {num2}?
      </label>

      <div className="flex items-center mb-4">
        {!captchaValidated ? (
          <>
            <input
              type="number"
              id="captcha-answer"
              placeholder="Enter your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />

            <button
              onClick={checkCaptcha}
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="flex items-center text-green-600 mt-2">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span>Verified Human</span>
          </div>
        )}
      </div>

      {captchaError && (
        <p className="text-red-500 text-sm mt-2">
          Incorrect answer, please try again!
        </p>
      )}
    </div>
  );
};

export default CaptchaCheck;
