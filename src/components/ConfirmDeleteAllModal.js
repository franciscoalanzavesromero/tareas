import React from "react";
import PropTypes from "prop-types";

const ConfirmDeleteAllModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          {/* Header con icono de advertencia */}
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmar Eliminación Masiva
            </h5>
            <button 
              className="btn-close btn-close-white" 
              onClick={onCancel}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Body con más detalles */}
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <i className="bi bi-trash3-fill text-danger" style={{ fontSize: "3rem" }}></i>
            </div>
            
            <h6 className="text-danger mb-3">
              ¡Esta acción no se puede deshacer!
            </h6>
            
            <p className="mb-2">
              Estás a punto de eliminar <strong>todas las tareas y proyectos</strong> del sistema.
            </p>
            
            <div className="alert alert-warning small mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Se perderán todos los datos: tareas, descripciones, estados, prioridades y notas.
            </div>
          </div>

          {/* Footer con botones más descriptivos */}
          <div className="modal-footer justify-content-center">
            <button 
              className="btn btn-outline-secondary" 
              onClick={onCancel}
              style={{ minWidth: "120px" }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancelar
            </button>
            <button 
              className="btn btn-danger" 
              onClick={onConfirm}
              style={{ minWidth: "120px" }}
            >
              <i className="bi bi-trash-fill me-1"></i>
              Eliminar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteAllModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDeleteAllModal;