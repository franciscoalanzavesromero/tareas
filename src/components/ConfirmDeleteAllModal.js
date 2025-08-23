import React from "react";

const ConfirmDeleteAllModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar borrado</h5>
            <button className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que quieres borrar todas las tareas?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Sí, borrar todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAllModal;
