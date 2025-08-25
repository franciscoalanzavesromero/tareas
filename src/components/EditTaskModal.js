import PropTypes from "prop-types";

const EditTaskModal = ({
  show,
  columns,
  taskData,
  onChange,
  onCancel,
  onSave,
}) => {
  if (!show) return null;

  return (
    <dialog
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      open
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar tarea</h5>
            <button className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            {columns.map((col) => (
              <div className="mb-3" key={col}>
                <label className="form-label" htmlFor={`edit-${col}`}>
                  {col}
                </label>
                {["Detalles", "Comentarios", "Precondiciones"].includes(col) ? (
                  <textarea
                    id={`edit-${col}`}
                    className="form-control"
                    rows={3}
                    value={taskData[col] || ""}
                    onChange={(e) => onChange(col, e.target.value)}
                  />
                ) : (
                  <input
                    id={`edit-${col}`}
                    type={col === "Link" ? "url" : "text"}
                    className="form-control"
                    value={taskData[col] || ""}
                    onChange={(e) => onChange(col, e.target.value)}
                  />
                )}
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
    </dialog>
  );
};

EditTaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  taskData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditTaskModal;
