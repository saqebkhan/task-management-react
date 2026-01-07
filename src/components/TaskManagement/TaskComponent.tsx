import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import ConfirmPopup from "@/common/ConfirmPopup";
import { formatDate, capitalizePriority } from "@/components/utils/utils";
import { ROUTE_NAMES } from "@/components/utils/constant";

interface Task {
  _id: string;
  title: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  stage: number;
}

interface Props {
  task: Task;
  updateStage: (payload: {
    taskId: string;
    newStage: number;
    oldStage: number;
  }) => void;
  deleteTask: (payload: { id: string }) => void;
}

const TaskComponent = ({ task, updateStage, deleteTask }: Props) => {
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);

  const changeStage = (increment: number) => {
    const newStage = task.stage + increment;
    if (newStage < 0 || newStage > 3) return;

    updateStage({
      taskId: task._id,
      newStage,
      oldStage: task.stage,
    });
  };

  const confirmDelete = () => {
    deleteTask({ id: task._id });
    setOpenDelete(false);
  };

  return (
    <>
      <ConfirmPopup
        open={openDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setOpenDelete(false)}
      />

      <p className="font-medium text-gray-800 text-lg mb-2">
        {task.title}
      </p>

      <div className="flex justify-between items-center mb-2">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            task.priority === "low"
              ? "bg-green-100 text-green-800"
              : task.priority === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {capitalizePriority(task.priority)}
        </span>

        <div className="flex space-x-2">
          <button
            draggable={false}
            onMouseDown={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            onClick={() =>
              navigate(
                `${ROUTE_NAMES.ADD_EDIT_FORM}?param=edit&id=${task._id}`
              )
            }
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            <PencilIcon className="w-5 h-5" />
          </button>

          <button
            draggable={false}
            onMouseDown={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            onClick={() => setOpenDelete(true)}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Due: {formatDate(task.deadline)}
      </p>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={task.stage === 0}
          onClick={() => changeStage(-1)}
          className="w-10 h-10 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-5 h-5 mx-auto" />
        </button>

        <span className="text-sm font-medium text-gray-700">
          Stage: {task.stage}
        </span>

        <button
          disabled={task.stage === 3}
          onClick={() => changeStage(1)}
          className="w-10 h-10 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
        >
          <ChevronRightIcon className="w-5 h-5 mx-auto" />
        </button>
      </div>
    </>
  );
};

export default TaskComponent;
