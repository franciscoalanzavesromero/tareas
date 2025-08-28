import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import ConfirmDeleteAllModal from "./components/ConfirmDeleteAllModal";
import EditTaskModal from "./components/EditTaskModal";
import AddTaskModal from "./components/AddTaskModal";
import Pagination from "./components/Pagination";
import ConfirmDeleteTaskModal from "./components/ConfirmDeleteTaskModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "bootstrap"; 

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
  const [taskToDelete, setTaskToDelete] = useState(null); // <-- Tarea a eliminar

  const itemsPerPage = 10;

  // Inicializar tooltips de Bootstrap
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((el) => new Tooltip(el));
  }, [tasks, currentPage]);

  // Añadir nueva tarea
  const addTask = () => {
    if (!newTask.DRS || !newTask.Descripcion) return;
    const taskToAdd = { ...newTask, id: uuidv4() };
    setTasks([...tasks, taskToAdd]);
    setNewTask(columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {}));
    setShowAddModal(false);
    toast.success(`La tarea se ha guardado correctamente`);
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
    toast.success(`La tarea se ha modificado correctamente`);
  };

  // Confirmar eliminación de tarea individual
  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
    toast.warn(`Se ha eliminado la tarea`);
    setTaskToDelete(null);
  };

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

  // Importar Excel
  const handleImportExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const tasksWithId = jsonData.map((t) => ({ ...t, id: uuidv4() }));
      setTasks((prev) => [...prev, ...tasksWithId]);
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
      {/* Indicador de resultados */}
      <div className="mb-2 text-end text-muted">
        Mostrando {paginatedTasks.length} de {filteredTasks.length} tareas
      </div>

      {/* Tabla */}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            {["DRS", "Descripcion", "Casos de prueba", "Estado", "Defecto", "Link"].map(
              (col) => (
                <th key={col}>{col}</th>
              )
            )}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              setEditTaskId={setEditTaskId}
              setEditTaskData={setEditTaskData}
              setTaskToDelete={setTaskToDelete} // <-- Pasamos función al TaskRow
            />
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modales */}
      <AddTaskModal
        show={showAddModal}
        columns={columns}
        taskData={newTask}
        onChange={(col, value) => setNewTask({ ...newTask, [col]: value })}
        onCancel={() => setShowAddModal(false)}
        onAdd={addTask}
      />

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

      <ConfirmDeleteAllModal
        show={showConfirmModal}
        onConfirm={clearAllTasks}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Modal eliminar tarea individual */}
{/* Modal eliminar tarea individual */}
<ConfirmDeleteTaskModal
  task={taskToDelete}
  onConfirm={confirmDeleteTask}
  onCancel={() => setTaskToDelete(null)}
/>


      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

// Fila con acordeón
const TaskRow = ({ task, setEditTaskId, setEditTaskData, setTaskToDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderCellContent = (col) => {
    if (col === "Link" && task[col]) {
      return (
        <a href={task[col]} target="_blank" rel="noreferrer">
          Ver
        </a>
      );
    }
    return task[col];
  };

  return (
    <React.Fragment>
      <tr>
        {["DRS", "Descripcion", "Casos de prueba", "Estado", "Defecto", "Link"].map(
          (col) => (
            <td key={col}>{renderCellContent(col)}</td>
          )
        )}
        <td>
          <div className="d-flex gap-1">
            {/* Ver detalles */}
            <button
              className="btn btn-sm btn-info"
              onClick={() => setIsOpen(!isOpen)}
              data-bs-toggle="tooltip"
              title="Ver detalles de la tarea"
            >
              <i className="bi bi-eye"></i>
            </button>

            {/* Editar */}
            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                setEditTaskId(task.id);
                setEditTaskData({ ...task });
              }}
              data-bs-toggle="tooltip"
              title="Editar tarea"
            >
              <i className="bi bi-pencil"></i>
            </button>

            {/* Eliminar */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setTaskToDelete(task)} // <-- Mostramos modal
              data-bs-toggle="tooltip"
              title="Eliminar tarea"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={7} style={{ padding: 0, backgroundColor: "#f8f9fa" }}>
            <div
              style={{
                margin: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Detalles */}
              <div style={{ marginBottom: "15px" }}>
                <h6 style={{ marginBottom: "5px", color: "#0d6efd" }}>
                  <i className="bi bi-card-text me-1"></i> Detalles
                </h6>
                <div
                  style={{ whiteSpace: "pre-wrap", color: "#495057" }}
                  dangerouslySetInnerHTML={{ __html: task.Detalles || "" }}
                />
              </div>

              {/* Precondiciones */}
              <div style={{ marginBottom: "15px" }}>
                <h6 style={{ marginBottom: "5px", color: "#0d6efd" }}>
                  <i className="bi bi-list-check me-1"></i> Precondiciones
                </h6>
                <div
                  style={{ whiteSpace: "pre-wrap", color: "#495057" }}
                  dangerouslySetInnerHTML={{ __html: task.Precondiciones || "" }}
                />
              </div>

              {/* Comentarios */}
              <div>
                <h6 style={{ marginBottom: "5px", color: "#0d6efd" }}>
                  <i className="bi bi-chat-left-text me-1"></i> Comentarios
                </h6>
                <div
                  style={{ whiteSpace: "pre-wrap", color: "#495057" }}
                  dangerouslySetInnerHTML={{ __html: task.Comentarios || "" }}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
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

TaskRow.propTypes = {
  task: PropTypes.object.isRequired,
  setEditTaskId: PropTypes.func.isRequired,
  setEditTaskData: PropTypes.func.isRequired,
  setTaskToDelete: PropTypes.func.isRequired,
};

export default TaskTable;
