import React, { useEffect, useState } from "react";
import ExcelUploader from "./ExcelUploader";
import TaskTable from "./TaskTable";
import { saveTasks, loadTasks } from "./storage";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      const saved = await loadTasks();
      setTasks(saved);
    })();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Tareas</h1>

      {/* Subida de Excel */}
      <ExcelUploader onData={setTasks} />

      {/* Tabla de tareas */}
      <TaskTable tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default App;
