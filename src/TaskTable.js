import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import ConfirmDeleteAllModal from "./components/ConfirmDeleteAllModal";
import EditTaskModal from "./components/EditTaskModal";
import AddTaskModal from "./components/AddTaskModal";
import Pagination from "./components/Pagination";
import ConfirmDeleteTaskModal from "./components/ConfirmDeleteTaskModal";
import { exportTaskToWord } from "./components/ExportWord";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "bootstrap";

const TaskTable = ({ tasks, setTasks }) => {
  // Nuevas columnas para gestión de proyectos
  const columns = [
    "ID Proyecto",
    "Nombre Tarea",
    "Subtareas",
    "Enlace",
    "Descripción Detallada",
    "Requisitos",
    "Estado",
    "Prioridad",
    "Notas",
  ];

  // Opciones predefinidas para estados y prioridades
  const statusOptions = ["✅ Pendiente", "🚧 En Progreso", "⏳ En Revisión", "✅ Completado", "❌ Bloqueado"];
  const priorityOptions = ["🔥 Alta", "⚠️ Media", "💡 Baja", "📅 Programada"];

  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const [newTask, setNewTask] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
  );
  const [taskToDelete, setTaskToDelete] = useState(null);

  const itemsPerPage = 10;

  // Inicializar tooltips de Bootstrap
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach((el) => {
      const tooltip = new Tooltip(el, {
        trigger: "hover focus",
      });
      el.addEventListener("click", () => {
        tooltip.hide();
      });
    });
  }, [tasks, currentPage]);

  // Añadir nueva tarea
  const addTask = () => {
    if (!newTask["ID Proyecto"] || !newTask["Nombre Tarea"]) return;
    const taskToAdd = { ...newTask, id: uuidv4() };
    setTasks([...tasks, taskToAdd]);
    setNewTask(columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {}));
    setShowAddModal(false);
    toast.success(`La tarea se ha creado correctamente`);
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
    toast.success(`La tarea se ha actualizado correctamente`);
  };

  // Confirmar eliminación de tarea individual
  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
    toast.warn(`Tarea eliminada correctamente`);
    setTaskToDelete(null);
  };

  // Exportar a Excel
  const exportToExcel = () => {
    if (!tasks.length) return;
    const worksheet = XLSX.utils.json_to_sheet(
      tasks.map(({ id, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas Proyectos");
    XLSX.writeFile(workbook, "Tareas_Proyectos.xlsx");
  };

  // Borrar todas las tareas
  const clearAllTasks = () => {
    setTasks([]);
    setShowConfirmModal(false);
    toast.info("Todas las tareas han sido eliminadas");
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
      toast.success(`${jsonData.length} tareas importadas correctamente`);
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
          <i className="bi bi-plus-circle me-1"></i>
          Nueva Tarea
        </button>
        <button className="btn btn-success" onClick={exportToExcel}>
          <i className="bi bi-file-earmark-excel me-1"></i>
          Exportar Excel
        </button>
        <label className="btn btn-info mb-0">
          <i className="bi bi-upload me-1"></i>
          Importar Excel
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
          <i className="bi bi-trash me-1"></i>
          Limpiar Todo
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar en tareas y proyectos..."
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
            {[
              "ID Proyecto",
              "Nombre Tarea",
              "Subtareas",
              "Estado",
              "Prioridad",
              "Enlace",
            ].map((col) => (
              <th key={col}>{col}</th>
            ))}
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
              setTaskToDelete={setTaskToDelete}
              statusOptions={statusOptions}
              priorityOptions={priorityOptions}
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
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        onChange={(col, value) => setNewTask({ ...newTask, [col]: value })}
        onCancel={() => setShowAddModal(false)}
        onAdd={addTask}
      />

      {/* Modal editar tarea */}
      <EditTaskModal
        show={!!editTaskId}
        columns={columns}
        taskData={editTaskData}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        onChange={(col, value) =>
          setEditTaskData({ ...editTaskData, [col]: value })
        }
        onCancel={() => {
          setEditTaskId(null);
          setEditTaskData({});
        }}
        onSave={saveEditTask}
      />

      {/* Modal eliminar todas las tareas */}
      <ConfirmDeleteAllModal
        show={showConfirmModal}
        onConfirm={clearAllTasks}
        onCancel={() => setShowConfirmModal(false)}
      />

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
const TaskRow = ({ task, setEditTaskId, setEditTaskData, setTaskToDelete, statusOptions, priorityOptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para aplicar estilos según el estado
  const getStatusBadge = (status) => {
    const baseClass = "badge";
    switch (status) {
      case "✅ Pendiente": return `${baseClass} bg-secondary`;
      case "🚧 En Progreso": return `${baseClass} bg-primary`;
      case "⏳ En Revisión": return `${baseClass} bg-warning`;
      case "✅ Completado": return `${baseClass} bg-success`;
      case "❌ Bloqueado": return `${baseClass} bg-danger`;
      default: return `${baseClass} bg-light text-dark`;
    }
  };

  // Función para aplicar estilos según la prioridad
  const getPriorityBadge = (priority) => {
    const baseClass = "badge";
    switch (priority) {
      case "🔥 Alta": return `${baseClass} bg-danger`;
      case "⚠️ Media": return `${baseClass} bg-warning`;
      case "💡 Baja": return `${baseClass} bg-info`;
      case "📅 Programada": return `${baseClass} bg-secondary`;
      default: return `${baseClass} bg-light text-dark`;
    }
  };

  const renderCellContent = (col) => {
    if (col === "Enlace" && task[col]) {
      return (
        <a href={task[col]} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
          <i className="bi bi-link-45deg"></i> Abrir
        </a>
      );
    }
    if (col === "Estado") {
      return <span className={getStatusBadge(task[col])}>{task[col]}</span>;
    }
    if (col === "Prioridad") {
      return <span className={getPriorityBadge(task[col])}>{task[col]}</span>;
    }
    return task[col];
  };

  return (
    <React.Fragment>
      <tr>
        {[
          "ID Proyecto",
          "Nombre Tarea",
          "Subtareas",
          "Estado",
          "Prioridad",
          "Enlace",
        ].map((col) => (
          <td key={col}>{renderCellContent(col)}</td>
        ))}
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

            {/* Exportar a Word */}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => exportTaskToWord(task)}
              data-bs-toggle="tooltip"
              title="Exportar a Word"
            >
              <i className="bi bi-file-earmark-word"></i>
            </button>

            {/* Eliminar */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setTaskToDelete(task)}
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
            <div className="p-3">
              {/* Descripción Detallada */}
              <div className="border border-light rounded bg-white p-3 mb-2">
                <h6 className="text-primary mb-2">
                  <i className="bi bi-card-text me-1"></i> Descripción Detallada
                </h6>
                <div
                  style={{ whiteSpace: "pre-wrap", color: "#495057" }}
                  dangerouslySetInnerHTML={{ __html: task["Descripción Detallada"] || "" }}
                />
              </div>

              {/* Requisitos */}
              <div className="border border-light rounded bg-white p-3 mb-2">
                <h6 className="text-primary mb-2">
                  <i className="bi bi-list-check me-1"></i> Requisitos
                </h6>
                <div
                  style={{ whiteSpace: "pre-wrap", color: "#495057" }}
                  dangerouslySetInnerHTML={{
                    __html: task.Requisitos || "",
                  }}
                />
              </div>

              {/* Notas */}
              <div className="border border-light rounded bg-white p-3">
                <h6 className="text-primary mb-2">
                  <i className="bi bi-chat-left-text me-1"></i> Notas
                </h6>
                <div
                  style={{ whiteSpace: "pre-wrap", color: "#495057" }}
                  dangerouslySetInnerHTML={{ __html: task.Notas || "" }}
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
      "ID Proyecto": PropTypes.string,
      "Nombre Tarea": PropTypes.string,
      "Subtareas": PropTypes.string,
      "Enlace": PropTypes.string,
      "Descripción Detallada": PropTypes.string,
      "Requisitos": PropTypes.string,
      "Estado": PropTypes.string,
      "Prioridad": PropTypes.string,
      "Notas": PropTypes.string,
    })
  ).isRequired,
  setTasks: PropTypes.func.isRequired,
};

TaskRow.propTypes = {
  task: PropTypes.object.isRequired,
  setEditTaskId: PropTypes.func.isRequired,
  setEditTaskData: PropTypes.func.isRequired,
  setTaskToDelete: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
  priorityOptions: PropTypes.array.isRequired,
};

export default TaskTable;