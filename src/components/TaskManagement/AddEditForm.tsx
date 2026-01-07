import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import { RootState } from "@/store/store";
import { setLoading, showToast } from "@/store/appSlice";
import apiConfig from "../apiConfig";
import { TaskForm } from "@/types/interfaces";

const todayDate = new Date().toISOString().split("T")[0];

const AddEditTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const isLoading = useSelector((state: RootState) => state.app.isLoading);
  const user = useSelector((state: RootState) => state.app.user);

  const isEdit = searchParams.get("param") === "edit";
  const taskId = searchParams.get("id");

  const [task, setTask] = useState<TaskForm>({
    userId: "",
    title: "",
    description: "",
    deadline: "",
    priority: "",
    stage: 0,
  });

  const [titleError, setTitleError] = useState(false);
  const [deadlineError, setDeadlineError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);

  useEffect(() => {
    if (isEdit && taskId) {
      loadTaskData(taskId);
    }
  }, [isEdit, taskId]);

  const loadTaskData = async (id: string) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(apiConfig.baseURL + `/tasks/${id}`);
      setTask(res.data);
    } catch {
      dispatch(
        showToast({
          message: "Error fetching task details.",
          type: TOAST_TYPES.ERROR,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const validateForm = () => {
    const tError = !task.title;
    const dError = !task.deadline;
    const pError = !task.priority;

    setTitleError(tError);
    setDeadlineError(dError);
    setPriorityError(pError);

    return !(tError || dError || pError);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));

      const payload = {
        userId: user?.id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        stage: task.stage || 0,
      };

      if (isEdit && taskId) {
        await axios.put(apiConfig.baseURL + `/tasks/${taskId}`, payload);
      } else {
        await axios.post(apiConfig.baseURL + "/tasks", payload);
      }

      dispatch(
        showToast({
          message: isEdit
            ? "Task updated successfully!"
            : "Task created successfully!",
          type: TOAST_TYPES.SUCCESS,
        })
      );

      navigate(ROUTE_NAMES.TASK_MANAGEMENT);
    } catch (error: any) {
      dispatch(
        showToast({
          message: isEdit
            ? "Error updating task. " + error?.response?.data?.message
            : "Error creating task. " + error?.response?.data?.message,
          type: TOAST_TYPES.ERROR,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isLoading) return null;

  return (
    <div className="h-[85vh] bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          {isEdit ? "Edit Task" : "Create New Task"}
        </h2>

        <form onSubmit={submitForm} className="space-y-6">
          <div>
            <label className="block font-medium">
              Task Title<span className="text-red-500">*</span>
            </label>
            <input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className={`mt-2 w-full p-3 border rounded-md ${
                titleError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {titleError && (
              <p className="text-red-600 text-sm">Title is required</p>
            )}
          </div>

          <div>
            <label className="block font-medium">
              Deadline<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={todayDate}
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
              className={`mt-2 w-full p-3 border rounded-md ${
                deadlineError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {deadlineError && (
              <p className="text-red-600 text-sm">Deadline is required</p>
            )}
          </div>

          <div>
            <label className="block font-medium">
              Priority<span className="text-red-500">*</span>
            </label>
            <select
              value={task.priority}
              onChange={(e) =>
                setTask({
                  ...task,
                  priority: e.target.value as TaskForm["priority"],
                })
              }
              className={`mt-2 w-full p-3 border rounded-md ${
                priorityError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {priorityError && (
              <p className="text-red-600 text-sm">Priority is required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex m-2">
            <button
              type="button"
              onClick={() => navigate(ROUTE_NAMES.TASK_MANAGEMENT)}
              className="w-full m-4 py-3 border-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full m-4 py-3 bg-indigo-600 text-white rounded-lg"
            >
              {isEdit ? "Edit Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTask;
