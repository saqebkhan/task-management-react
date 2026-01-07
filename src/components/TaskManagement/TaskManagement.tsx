import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import TaskComponent from "./TaskComponent";
import ConfirmPopup from "@/common/ConfirmPopup";
import apiConfig from "../apiConfig";

import { TrashIcon } from "@heroicons/react/24/outline";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import { RootState } from "@/store/store";
import { showToast, setLoading } from "@/store/appSlice";
import { Task } from "@/types/interfaces";

const TaskManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.app);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const draggedTaskRef = useRef<Task | null>(null);

  const fetchTasks = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(apiConfig.baseURL + "/tasks");

      const userTasks = res.data.filter(
        (task: Task) => task.userId === user?.id
      );

      setTasks(userTasks);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const backlogTasks = tasks.filter((t) => t.stage === 0);
  const todoTasks = tasks.filter((t) => t.stage === 1);
  const inProgressTasks = tasks.filter((t) => t.stage === 2);
  const doneTasks = tasks.filter((t) => t.stage === 3);

  const onDragStart = (_: React.DragEvent, task: Task) => {
    draggedTaskRef.current = task;
    setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStage: number
  ) => {
    e.preventDefault();

    const draggedTask = draggedTaskRef.current;
    if (!draggedTask || draggedTask.stage === newStage) return;

    const oldStage = draggedTask.stage;

    // ✅ OPTIMISTIC UI
    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggedTask._id ? { ...t, stage: newStage } : t
      )
    );

    draggedTaskRef.current = null;
    setIsDragging(false);

    try {
      await axios.put(apiConfig.baseURL + `/tasks/${draggedTask._id}`, {
        stage: newStage,
      });

      dispatch(
        showToast({
          message: "Task updated successfully",
          type: TOAST_TYPES.SUCCESS,
        })
      );
    } catch (err) {
      console.error(err);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === draggedTask._id ? { ...t, stage: oldStage } : t
        )
      );

      dispatch(
        showToast({
          message: "Failed to update task",
          type: TOAST_TYPES.ERROR,
        })
      );
    }
  };

  const updateStage = async ({
    taskId,
    newStage,
    oldStage,
  }: {
    taskId: string;
    newStage: number;
    oldStage: number;
  }) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, stage: newStage } : t))
    );

    try {
      await axios.put(apiConfig.baseURL + `/tasks/${taskId}`, {
        stage: newStage,
      });

      dispatch(
        showToast({
          message: "Task updated successfully",
          type: TOAST_TYPES.SUCCESS,
        })
      );
    } catch (err) {
      console.error(err);

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, stage: oldStage } : t))
      );

      dispatch(
        showToast({
          message: "Failed to update task",
          type: TOAST_TYPES.ERROR,
        })
      );
    }
  };
  const confirmDelete = () => {
    if (!draggedTaskRef.current) return;

    setDeletingId(draggedTaskRef.current._id);
    setOpenDeleteDialog(true);
    setIsDragging(false);
  };

  const deleteTask = async () => {
    if (!deletingId) return;

    // optimistic
    setTasks((prev) => prev.filter((t) => t._id !== deletingId));

    try {
      await axios.delete(apiConfig.baseURL + "/tasks/" + deletingId);

      dispatch(
        showToast({
          message: "Task deleted successfully",
          type: TOAST_TYPES.SUCCESS,
        })
      );
    } catch {
      dispatch(
        showToast({
          message: "Error deleting task",
          type: TOAST_TYPES.ERROR,
        })
      );
      fetchTasks();
    } finally {
      setOpenDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const renderColumn = (title: string, list: Task[], stage: number) => (
    <div
      className="bg-gray-100 p-4 rounded-lg shadow-md"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
    >
      <h3 className="text-xl font-semibold mb-4 sticky -top-10 bg-gray-100 p-2">
        {title}
      </h3>

      {list.map((task) => (
        <div
          key={task._id}
          draggable
          onDragStart={(e) => onDragStart(e, task)}
          className="bg-white p-4 mb-4 rounded-lg shadow-md"
        >
          <TaskComponent
            task={task}
            updateStage={updateStage}
            deleteTask={({ id }) => {
              setDeletingId(id);
              setOpenDeleteDialog(true);
            }}
          />
        </div>
      ))}
    </div>
  );

  if (isLoading) return null;

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl max-h-[82vh] overflow-y-auto">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Task Management
        </h2>

        <button
          onClick={() => navigate(ROUTE_NAMES.ADD_EDIT_FORM)}
          className="bg-indigo-600 text-white m-4 px-4 py-2 rounded-lg"
        >
          Create Task
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {renderColumn("Backlog", backlogTasks, 0)}
          {renderColumn("Todo", todoTasks, 1)}
          {renderColumn("In Progress", inProgressTasks, 2)}
          {renderColumn("Done", doneTasks, 3)}
        </div>

        {isDragging && (
          <div
            onDrop={confirmDelete}
            onDragOver={(e) => e.preventDefault()}
            className="fixed bottom-8 right-8 bg-red-600 p-4 rounded-full z-50"
          >
            <TrashIcon className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      <ConfirmPopup
        open={openDeleteDialog}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteTask}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </div>
  );
};

export default TaskManagement;
