import React, { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

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
    setNewTask(columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {}));
    setShowAddModal(false);
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

          {/* Siempre mostrar primera página */}
          {currentPage > 3 && (
            <>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            </>
          )}

          {/* Rango alrededor de la página actual */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) => page >= currentPage - 2 && page <= currentPage + 2
            )
            .map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}

          {/* Siempre mostrar última página */}
          {currentPage < totalPages - 2 && (
            <>
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

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

      {/* Modal añadir */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Añadir nueva tarea</h5>
                <button
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

      {/* Modal editar */}
      {editTaskId && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar tarea</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setEditTaskId(null);
                    setEditTaskData({});
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {columns.map((col) => (
                  <div className="mb-3" key={col}>
                    <label className="form-label">{col}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTaskData[col] || ""}
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
                  onClick={() => {
                    setEditTaskId(null);
                    setEditTaskData({});
                  }}
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

      {/* Modal borrar todas */}
      {showConfirmModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar borrado</h5>
                <button
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
