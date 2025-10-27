import React from "react";
import PropTypes from "prop-types";

const ConfirmDeleteTaskModal = ({ task, onConfirm, onCancel }) => {
  if (!task) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          {/* Header con icono de advertencia */}
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmar Eliminación
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Body con detalles de la tarea */}
          <div className="modal-body">
            <div className="text-center mb-3">
              <i className="bi bi-trash3 text-warning" style={{ fontSize: "2.5rem" }}></i>
            </div>
            
            <p className="text-center mb-3">
              ¿Estás seguro de que deseas eliminar esta tarea del proyecto?
            </p>

            {/* Tarjeta con información de la tarea */}
            <div className="card border-warning mb-3">
              <div className="card-body">
                <h6 className="card-title text-primary mb-2">
                  <i className="bi bi-card-heading me-1"></i>
                  {task["Nombre Tarea"] || "Sin nombre"}
                </h6>
                
                <div className="row small text-muted">
                  <div className="col-6">
                    <strong>ID Proyecto:</strong>
                    <br />
                    {task["ID Proyecto"] || "No especificado"}
                  </div>
                  <div className="col-6">
                    <strong>Estado:</strong>
                    <br />
                    {task["Estado"] || "No especificado"}
                  </div>
                </div>

                {task["Subtareas"] && (
                  <div className="mt-2">
                    <strong>Subtareas:</strong>
                    <br />
                    <span className="small">{task["Subtareas"]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Advertencia */}
            <div className="alert alert-warning small mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Esta acción no se puede deshacer. La tarea se eliminará permanentemente.
            </div>
          </div>

          {/* Footer con botones */}
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              style={{ minWidth: "100px" }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              style={{ minWidth: "100px" }}
            >
              <i className="bi bi-trash-fill me-1"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteTaskModal.propTypes = {
  task: PropTypes.shape({
    "ID Proyecto": PropTypes.string,
    "Nombre Tarea": PropTypes.string,
    "Subtareas": PropTypes.string,
    "Estado": PropTypes.string,
    "Prioridad": PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDeleteTaskModal;