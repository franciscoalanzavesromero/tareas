import PropTypes from "prop-types";
import WysiwygEditor from "./WysiwygEditor";

const EditTaskModal = ({
  show,
  columns,
  taskData,
  statusOptions,
  priorityOptions,
  onChange,
  onCancel,
  onSave,
}) => {
  if (!show) return null;

  // Campos que usarán el editor WYSIWYG
  const richTextFields = ["Descripción Detallada", "Requisitos", "Notas"];
  
  // Campos que son selects
  const selectFields = {
    "Estado": statusOptions,
    "Prioridad": priorityOptions
  };

  return (
    <dialog
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      open
    >
      <div
        className="modal-dialog modal-lg"
        style={{ maxWidth: "900px" }}
      >
        <div
          className="modal-content"
          style={{ maxWidth: "100%", width: "100%", overflowX: "hidden" }}
        >
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              Editar Tarea
            </h5>
            <button
              className="btn-close"
              onClick={onCancel}
              aria-label="Cerrar"
            ></button>
          </div>

          <div
            className="modal-body"
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div className="row">
              {columns.map((col, index) => (
                <div
                  key={col + index}
                  className={
                    richTextFields.includes(col) 
                      ? "col-12" 
                      : "col-12 col-md-6"
                  }
                  style={{ marginBottom: "1rem" }}
                >
                  <label
                    className="form-label fw-bold"
                    htmlFor={`edit-${col}`}
                    style={{ display: "block", marginBottom: "0.5rem" }}
                  >
                    {col}
                    {(col === "ID Proyecto" || col === "Nombre Tarea") && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>

                  {(() => {
                    // Campo de texto enriquecido
                    if (richTextFields.includes(col)) {
                      return (
                        <div className="rich-text-container">
                          <WysiwygEditor
                            value={taskData[col] || ""}
                            onChange={(val) => onChange(col, val)}
                            placeholder={`Editar ${col.toLowerCase()}...`}
                          />
                        </div>
                      );
                    }

                    // Campo select para Estado y Prioridad
                    if (selectFields[col]) {
                      return (
                        <select
                          id={`edit-${col}`}
                          className="form-select"
                          value={taskData[col] || ""}
                          onChange={(e) => onChange(col, e.target.value)}
                        >
                          <option value="">Seleccionar {col}</option>
                          {selectFields[col].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    // Campo de enlace
                    if (col === "Enlace") {
                      return (
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-link-45deg"></i>
                          </span>
                          <input
                            id={`edit-${col}`}
                            type="url"
                            className="form-control"
                            placeholder="https://ejemplo.com"
                            value={taskData[col] || ""}
                            onChange={(e) => onChange(col, e.target.value)}
                          />
                        </div>
                      );
                    }

                    // Campo de texto normal
                    return (
                      <input
                        id={`edit-${col}`}
                        type="text"
                        className="form-control"
                        placeholder={`Editar ${col.toLowerCase()}...`}
                        value={taskData[col] || ""}
                        onChange={(e) => onChange(col, e.target.value)}
                        readOnly={col === "ID Proyecto"} // ID no editable para mantener consistencia
                      />
                    );
                  })()}
                </div>
              ))}
            </div>

            {/* Información de campos */}
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Los campos marcados con <span className="text-danger">*</span> son obligatorios. 
                El <strong>ID Proyecto</strong> no se puede modificar para mantener la consistencia de los datos.
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="btn btn-outline-secondary" 
              onClick={onCancel}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancelar
            </button>
            <button 
              className="btn btn-success" 
              onClick={onSave}
              disabled={!taskData["ID Proyecto"] || !taskData["Nombre Tarea"]}
            >
              <i className="bi bi-check-circle me-1"></i>
              Guardar Cambios
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
  statusOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  priorityOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditTaskModal;