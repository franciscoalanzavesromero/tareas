import React, { useEffect, useState } from "react";
import TaskTable from "./TaskTable";
import { saveTasks, loadTasks } from "./storage";
import Login from "./components/Login";


function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cargar tareas guardadas
  useEffect(() => {
    (async () => {
      const saved = await loadTasks();
      setTasks(saved);
    })();
  }, []);

  // Guardar tareas cuando cambian
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  return (
    <div className="container mt-4">
      {isLoggedIn ? (
        <>
          <h1 className="mb-4">Gestión de Tareas</h1>
          <TaskTable tasks={tasks} setTasks={setTasks} />
        </>
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
