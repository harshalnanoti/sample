import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Taskform from "../components/Taskform";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import TaskItem from "../components/TaskItem";
import { getTasks, reset } from "../features/task/taskSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getTasks());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, navigate, dispatch]);

  return (
    <>
      {isLoading && <Spinner />}
      <section className="heading">
        {/* <h1>Welcome {user?.name}</h1> */}
        <p>Tasks Dashboard</p>
      </section>
      <Taskform />

      <section className="content">
        {tasks.length > 0 ? (
          <div className="tasks">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <h3> You don't have any tasks </h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
