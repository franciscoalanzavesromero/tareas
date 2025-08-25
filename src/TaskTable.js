import React, { useState } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import ConfirmDeleteAllModal from "./components/ConfirmDeleteAllModal";
import EditTaskModal from "./components/EditTaskModal";
import AddTaskModal from "./components/AddTaskModal";
import Pagination from "./components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskTable = ({ tasks, setTasks }) => {
  const columns = [
    "DRS",
    "Descripcion",
    "Casos de prueba",
    "Link",
    "Detalles",
    "Precondiciones",
    "Estado",
    "Defecto",
    "Comentarios",
  ];

  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const [newTask, setNewTask] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
  );

  const itemsPerPage = 5;

  // Añadir nueva tarea
  const addTask = () => {
    if (!newTask.DRS || !newTask.Descripcion) return;

    const taskToAdd = { ...newTask, id: uuidv4() };
    setTasks([...tasks, taskToAdd]);

    // Resetear formulario
    setNewTask(columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {}));
    setShowAddModal(false);

    // Mostrar toast de éxito
    toast.success("La tarea se ha guardado correctamente");
  };

  // Guardar edición
  const saveEditTask = () => {
    setTasks(
      tasks.map((t) =>
        t.id === editTaskId ? { ...editTaskData, id: editTaskId } : t
      )
    );
    setEditTaskId(null);
    setEditTaskData({});

  // Mostrar toast de éxito al guardar cambios
   toast.success("La tarea se ha modificado correctamente");
  };

  // Eliminar tarea individual
  const removeTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  // Exportar a Excel
  const exportToExcel = () => {
    if (!tasks.length) return;
    const worksheet = XLSX.utils.json_to_sheet(
      tasks.map(({ id, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");
    XLSX.writeFile(workbook, "Tareas.xlsx");
  };

  // Borrar todas las tareas
  const clearAllTasks = () => {
    setTasks([]);
    setShowConfirmModal(false);
  };

  // Filtrado
  const filteredTasks = tasks.filter((task) =>
    columns.some((col) =>
      (task[col]?.toString() || "")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
  );

  // Paginación
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Importar Excel (concatena tareas)
  const handleImportExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const tasksWithId = jsonData.map((t) => ({ ...t, id: uuidv4() }));
      setTasks((prev) => [...prev, ...tasksWithId]); // CONCATENA en lugar de reemplazar
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      {/* Botones */}
      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Añadir nueva tarea
        </button>
        <button className="btn btn-success" onClick={exportToExcel}>
          Exportar a Excel
        </button>
        <label className="btn btn-info mb-0">
          Importar Excel{" "}
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={(e) => handleImportExcel(e.target.files[0])}
          />
        </label>
        <button
          className="btn btn-warning"
          onClick={() => setShowConfirmModal(true)}
        >
          Borrar todas las tareas
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar tareas..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Tabla */}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map((task) => (
            <tr key={task.id}>
              {columns.map((col) => (
                <td key={col}>
                  {col === "Link" && task[col] ? (
                    <a href={task[col]} target="_blank" rel="noreferrer">
                      Ver
                    </a>
                  ) : (
                    task[col]
                  )}
                </td>
              ))}
              <td>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setEditTaskId(task.id);
                      setEditTaskData({ ...task });
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeTask(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal añadir tarea */}
      <AddTaskModal
        show={showAddModal}
        columns={columns}
        taskData={newTask}
        onChange={(col, value) => setNewTask({ ...newTask, [col]: value })}
        onCancel={() => setShowAddModal(false)}
        onAdd={addTask}
      />

      {/* Modal editar tarea */}
      <EditTaskModal
        show={!!editTaskId}
        columns={columns}
        taskData={editTaskData}
        onChange={(col, value) =>
          setEditTaskData({ ...editTaskData, [col]: value })
        }
        onCancel={() => {
          setEditTaskId(null);
          setEditTaskData({});
        }}
        onSave={saveEditTask}
      />

      {/* Modal borrar todas */}
      <ConfirmDeleteAllModal
        show={showConfirmModal}
        onConfirm={clearAllTasks}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      DRS: PropTypes.string,
      Descripcion: PropTypes.string,
      "Casos de prueba": PropTypes.string,
      Link: PropTypes.string,
      Detalles: PropTypes.string,
      Precondiciones: PropTypes.string,
      Estado: PropTypes.string,
      Defecto: PropTypes.string,
      Comentarios: PropTypes.string,
    })
  ).isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default TaskTable;
