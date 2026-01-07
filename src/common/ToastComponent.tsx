import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { RootState } from "@/store/store";
import { hideToast } from "@/store/appSlice";
import { TOAST_TYPES } from "@/components/utils/constant";

const ToastComponent = () => {
  const dispatch = useDispatch();

  const toast = useSelector(
    (state: RootState) => state.app.toast
  );

  useEffect(() => {
    if (!toast.isVisible) return;

    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.isVisible, dispatch]);

  if (!toast.isVisible) return null;

  const isSuccess = toast.type === TOAST_TYPES.SUCCESS;

  return (
    <div
      className="flex items-center fixed bottom-0 right-0 p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
      role="alert"
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
          isSuccess
            ? "bg-green-100 text-green-500"
            : "bg-red-100 text-red-500"
        }`}
      >
        {isSuccess ? (
          <CheckCircleIcon className="w-5 h-5" />
        ) : (
          <XCircleIcon className="w-5 h-5" />
        )}
      </div>

      <div className="ms-3 text-sm font-normal">
        {toast.message}
      </div>

      <button
        onClick={() => dispatch(hideToast())}
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg ml-1.5 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
        aria-label="Close"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ToastComponent;
