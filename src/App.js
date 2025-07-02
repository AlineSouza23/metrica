import React, { useEffect, useState, useCallback } from "react";

// Sample data
const sampleData = [
  {
    periodicidade: "1h",
    plataforma: "Debito",
    tipoMetrica: "Timeout",
    min: "0",
    max: "9999999",
    ocorrencias: "1",
    diario: "50.0",
    semana: "1",
    dif: "100.0",
  },
  {
    periodicidade: "1d",
    plataforma: "Credito",
    tipoMetrica: "Cancelada",
    min: "5",
    max: "9",
    ocorrencias: "1",
    diario: "90.0",
    semana: "10",
    dif: "10.0",
  },
];

const App = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorSenha, setErrorSenha] = useState(false);
  const [filters, setFilters] = useState({
    geral1: "",
    geral2: "",
    plataforma: "",
    minCapturas: "",
  });

  const aplicarFiltros = useCallback(() => {
    const { geral1, geral2, plataforma, minCapturas } = filters;

    const filtrado = originalData.filter((item) => {
      const jsonStr = JSON.stringify(item).toLowerCase();
      const matchFiltro1 = geral1 === "" || jsonStr.includes(geral1.toLowerCase());
      const matchFiltro2 = geral2 === "" || jsonStr.includes(geral2.toLowerCase());
      const plat = (item.plataforma || "").toLowerCase();
      const matchPlataforma = plataforma === "" || plat.includes(plataforma.toLowerCase());
      const min = parseInt(item.min || 0);
      const matchMin = minCapturas === "" || min >= parseInt(minCapturas);

      return matchFiltro1 && matchFiltro2 && matchPlataforma && matchMin;
    });

    setData(filtrado);
  }, [filters, originalData]);

  useEffect(() => {
    setData(sampleData);
    setOriginalData(sampleData);
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  const handleInputChange = (e, index, key) => {
    const newData = [...data];
    newData[index][key] = e.target.value;
    setData(newData);
  };

  const toggleEdit = () => {
    if (data.length === 0) {
      alert("Dados ainda não carregados.");
      return;
    }
    setShowPasswordModal(true);
    setPassword("");
    setErrorSenha(false);
  };

  const validarSenha = () => {
    if (password === "COEmonitoria2025") {
      setEditMode(true);
      setShowPasswordModal(false);
    } else {
      setErrorSenha(true);
    }
  };

  const salvar = () => {
    setEditMode(false);
    setOriginalData([...data]);
    alert("Dados salvos localmente.");
  };

  return (
    <div className="container">
      {/* Modal de Senha */}
      {showPasswordModal && (
        <div
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Digite a senha para editar</h3>
            <input
              type="password"
              placeholder="Senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: 10,
                width: "100%",
                marginTop: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            />
            <div style={{ marginTop: 20 }}>
              <button onClick={validarSenha}>Confirmar</button>
              <button onClick={() => setShowPasswordModal(false)}>Cancelar</button>
            </div>
            {errorSenha && (
              <p style={{ color: "red", marginTop: 10 }}>Senha incorreta</p>
            )}
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="header">
        <div className="header-title">Tabela Dinâmica de Métricas</div>
        <div className="header-center">Total: {data.length}</div>
        <button className="header-link">Documento RCA</button>
      </div>

      {/* Filtros */}
      <div className="filters">
        <input placeholder="Filtro geral..." onChange={(e) => setFilters({ ...filters, geral1: e.target.value })} />
        <input placeholder="filtro geral..." onChange={(e) => setFilters({ ...filters, geral2: e.target.value })} />
        <input placeholder="Filtrar por Plataforma..." onChange={(e) => setFilters({ ...filters, plataforma: e.target.value })} />
        <input placeholder="Min Capturas..." type="number" onChange={(e) => setFilters({ ...filters, minCapturas: e.target.value })} />
      </div>

      {/* Botões */}
      <div className="button-bar">
        <button onClick={toggleEdit} className="alterar">Alterar</button>
        {editMode && <button onClick={salvar} className="salvar">Salvar</button>}
      </div>

      {/* Tabela */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Periodicidade</th>
              <th>Plataforma</th>
              <th>Tipo de Métrica</th>
              <th>Min</th>
              <th>Max</th>
              <th>Ocorrências</th>
              <th>dailyPercentage</th>
              <th>lastWeek</th>
              <th>diffLastWeek</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.keys(row).map((key, i) => (
                  <td key={i}>
                    {editMode ? (
                      <input
                        value={row[key]}
                        onChange={(e) => handleInputChange(e, idx, key)}
                      />
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS Inline */}
      <style>{`
        * { box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f7fa;
          color: #333;
        }
        .container {
          background: rgba(255, 255, 255, 0.9);
          padding: 30px 40px;
          border-radius: 24px;
          max-width: 1400px;
          margin: 0 auto;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          overflow-x: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 25px;
          gap: 15px;
        }
        .header-title {
          font-size: 28px;
          font-weight: 700;
          flex: 1 1 300px;
          text-align: center;
          color: #222;
          margin: 0;
        }
        .header-center {
          font-weight: 600;
          font-size: 18px;
          color: #555;
          flex: 1 1 150px;
          text-align: center;
        }
        .header-link {
          background-color: #000;
          color: #fff;
          border-radius: 30px;
          padding: 12px 22px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          white-space: nowrap;
          transition: background-color 0.3s ease;
          flex-shrink: 0;
        }
        .header-link:hover {
          background-color: #333;
        }
        .filters {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }
        .filters input {
          flex: 1 1 220px;
          min-width: 220px;
          padding: 12px 15px;
          border: 1px solid #bbb;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        .filters input:focus {
          border-color: #333;
          outline: none;
          box-shadow: 0 0 5px rgba(0,0,0,0.15);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px 15px;
          text-align: left;
          font-size: 0.95rem;
        }
        th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #555;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        tbody tr:hover {
          background-color: #f1f5f9;
          cursor: default;
        }
        .button-bar {
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
        }
        .button-bar button {
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          min-width: 100px;
        }
        .button-bar button:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .button-bar button.alterar {
          background-color: #2f80ed;
          color: white;
        }
        .button-bar button.alterar:hover {
          background-color: #1366d6;
        }
        .button-bar button.salvar {
          background-color: #27ae60;
          color: white;
        }
        .button-bar button.salvar:hover {
          background-color: #1e874b;
        }
        .button-bar button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          box-shadow: none;
          color: #666;
        }
        @media (max-width: 800px) {
          .header-title, .header-center {
            flex-basis: 100%;
            margin-bottom: 10px;
          }
          .filters input {
            flex-basis: 100%;
          }
          table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
