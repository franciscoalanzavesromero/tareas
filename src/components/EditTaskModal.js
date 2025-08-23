import React from "react";

const EditTaskModal = ({ show, columns, taskData, onChange, onCancel, onSave }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar tarea</h5>
            <button className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            {columns.map((col) => (
              <div className="mb-3" key={col}>
                <label className="form-label">{col}</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskData[col] || ""}
                  onChange={(e) => onChange(col, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={onSave}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
