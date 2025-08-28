import PropTypes from "prop-types";
import WysiwygEditor from "./WysiwygEditor";

const AddTaskModal = ({
  show,
  columns,
  taskData,
  onChange,
  onCancel,
  onAdd,
}) => {
  if (!show) return null;

  return (
    <dialog
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      open
    >
      <div
        className="modal-dialog modal-fullscreen"
        style={{ margin: 0, maxWidth: "100%", width: "100%" }}
      >
        <div
          className="modal-content"
          style={{ maxWidth: "100%", width: "100%", overflowX: "hidden" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Añadir nueva tarea</h5>
            <button
              className="btn-close"
              onClick={onCancel}
              aria-label="Cerrar"
            ></button>
          </div>

          <div
            className="modal-body"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {columns.map((col, index) => (
              <div
                key={col + index}
                style={{ width: "100%", marginBottom: "1rem" }}
              >
                <label
                  className="form-label"
                  htmlFor={`add-${col}`}
                  style={{ display: "block", marginBottom: "0.25rem" }}
                >
                  {col}
                </label>

                {(() => {
                  if (["Comentarios", "Detalles", "Precondiciones"].includes(col)) {
                    return (
                      <WysiwygEditor
                        value={taskData[col]}
                        onChange={(val) => onChange(col, val)}
                      />
                    );
                  }
                  return (
                    <input
                      id={`add-${col}`}
                      type={col === "Link" ? "url" : "text"}
                      className="form-control"
                      style={{ width: "100%" }}
                      value={taskData[col] ?? ""}
                      onChange={(e) => onChange(col, e.target.value)}
                    />
                  );
                })()}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={onAdd}>
              Añadir tarea
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

AddTaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  taskData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddTaskModal;
