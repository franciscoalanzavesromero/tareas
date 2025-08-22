import React, { useState } from "react";
import * as XLSX from "xlsx";

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
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [editTaskData, setEditTaskData] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
  );

  const itemsPerPage = 5;

  const [newTask, setNewTask] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
  );

  // Añadir tarea
  const addTask = () => {
    if (!newTask.DRS || !newTask.Descripcion) return;
    setTasks([...tasks, newTask]);
    setNewTask(columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {}));
    setShowAddModal(false);
  };

  // Guardar tarea editada
  const saveEditTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editTaskIndex] = editTaskData;
    setTasks(updatedTasks);
    setEditTaskIndex(null);
  };

  // Eliminar tarea individual
  const removeTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  // Exportar a Excel
  const exportToExcel = () => {
    if (!tasks || tasks.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");
    XLSX.writeFile(workbook, "Tareas.xlsx");
  };

  // Borrar todas las tareas
  const clearAllTasks = () => {
    setTasks([]);
    setShowConfirmModal(false);
  };

  // Filtrado seguro
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

  return (
    <div>
      {/* Botones arriba del DataTable */}
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
          {paginatedTasks.map((task, i) => (
            <tr key={i}>
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
                      setEditTaskIndex((currentPage - 1) * itemsPerPage + i);
                      setEditTaskData(task);
                    }}
                    title="Editar tarea"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      removeTask((currentPage - 1) * itemsPerPage + i)
                    }
                    title="Eliminar tarea"
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
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal añadir tarea */}
      {showAddModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Añadir nueva tarea</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {columns.map((col) => (
                  <div className="mb-3" key={col}>
                    <label className="form-label">{col}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTask[col]}
                      onChange={(e) =>
                        setNewTask({ ...newTask, [col]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={addTask}>
                  Añadir tarea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar tarea */}
      {editTaskIndex !== null && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar tarea</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditTaskIndex(null)}
                ></button>
              </div>
              <div className="modal-body">
                {columns.map((col) => (
                  <div className="mb-3" key={col}>
                    <label className="form-label">{col}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTaskData[col]}
                      onChange={(e) =>
                        setEditTaskData({
                          ...editTaskData,
                          [col]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditTaskIndex(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={saveEditTask}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal borrar todas las tareas */}
      {showConfirmModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar borrado</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres borrar todas las tareas?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={clearAllTasks}>
                  Sí, borrar todo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
