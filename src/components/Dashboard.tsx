import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { setLoading } from "@/store/appSlice";
import apiConfig from "./apiConfig";

interface Task {
  userId: string | number;
  stage: number;
}

const Dashboard = () => {
  const dispatch = useDispatch();

  const { isLoading, user } = useSelector(
    (state: RootState) => state.app
  );

  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [doneTasks, setDoneTasks] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      dispatch(setLoading(true));

      const response = await axios.get(
        `${apiConfig.baseURL}/tasks`
      );

      const tasks: Task[] = response.data.filter(
        (task: Task) => task.userId === user.id
      );

      const total = tasks.length;
      let pending = 0;
      let done = 0;

      tasks.forEach((task) => {
        if (task.stage === 3) {
          done++;
        } else {
          pending++;
        }
      });

      setTotalTasks(total);
      setPendingTasks(pending);
      setDoneTasks(done);
      setProgressPercentage(
        total > 0 ? (done / total) * 100 : 0
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="h-[85vh] bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold">{totalTasks}</div>
            <div className="text-lg">Total Tasks</div>
          </div>

          <div className="bg-yellow-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold">{pendingTasks}</div>
            <div className="text-lg">Pending Tasks</div>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold">{doneTasks}</div>
            <div className="text-lg">Done Tasks</div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Task Progress
          </h3>

          <div className="h-2 w-full bg-gray-300 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-end text-sm mt-2 text-gray-600">
            <span>{Math.round(progressPercentage)}% Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
