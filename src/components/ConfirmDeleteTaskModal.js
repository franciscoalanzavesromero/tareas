import React from "react";
import PropTypes from "prop-types";

const ConfirmDeleteTaskModal = ({ task, onConfirm, onCancel }) => {
  if (!task) return null; // No mostrar si no hay tarea seleccionada

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar eliminación</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas eliminar la tarea?</p>
            <p>
              <strong>{task["Casos de prueba"]}</strong>
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteTaskModal.propTypes = {
  task: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDeleteTaskModal;
