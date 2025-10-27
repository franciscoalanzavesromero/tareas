import React, { useState } from "react";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones básicas
    if (!username.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setIsLoading(true);

    // Simulamos una pequeña demora para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Credenciales - Podemos hacer esto más configurable en el futuro
    if (username === "admin" && password === "admin123") {
      setError("");
      onLogin(); // Avisamos al componente padre que el login fue correcto
    } else if (username === "usuario" && password === "usuario123") {
      setError("");
      onLogin();
    } else if (username === "proyectos" && password === "proyectos2024") {
      setError("");
      onLogin();
    } else {
      setError("Usuario o contraseña incorrectos");
    }

    setIsLoading(false);
  };

  // Credenciales de demostración para facilitar testing
  const demoCredentials = [
    { user: "admin", pass: "admin123", role: "Administrador" },
    { user: "usuario", pass: "usuario123", role: "Usuario estándar" },
    { user: "proyectos", pass: "proyectos2024", role: "Gestor de proyectos" }
  ];

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "cover"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            {/* Tarjeta de login */}
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                {/* Header con logo */}
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: "60px", height: "60px" }}>
                    <i className="bi bi-kanban-fill text-white" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <h3 className="card-title fw-bold text-dark">Gestor de Proyectos</h3>
                  <p className="text-muted">Inicia sesión en tu cuenta</p>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="bi bi-person me-1"></i>
                      Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingresa tu usuario"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock me-1"></i>
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </button>
                </form>

                {/* Información de credenciales de demo (solo en desarrollo) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4">
                    <div className="accordion" id="demoCredentials">
                      <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed bg-light" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#demoCredentialsContent"
                          >
                            <small className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              Credenciales de demostración
                            </small>
                          </button>
                        </h2>
                        <div 
                          id="demoCredentialsContent" 
                          className="accordion-collapse collapse"
                          data-bs-parent="#demoCredentials"
                        >
                          <div className="accordion-body p-2">
                            {demoCredentials.map((cred, index) => (
                              <div key={index} className="mb-2">
                                <small className="text-muted d-block">
                                  <strong>{cred.role}:</strong>
                                </small>
                                <small className="text-muted">
                                  Usuario: <code>{cred.user}</code> | 
                                  Contraseña: <code>{cred.pass}</code>
                                </small>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="card-footer bg-light border-0 text-center py-3">
                <small className="text-muted">
                  © 2024 Gestor de Proyectos · v2.0
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;