import React, { useState, useRef } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/apply_filter';

const FILTERS = [
  { name: 'Média (Blur)', key: 'mean_blur', requiresKernel: true },
  { name: 'Gaussiano', key: 'gaussian_blur', requiresKernel: true },
  { name: 'Mediana', key: 'median_blur', requiresKernel: true },
  { name: 'Canny (Bordas)', key: 'canny', requiresKernel: false },
  { name: 'Sobel (Bordas)', key: 'sobel', requiresKernel: false },
];

const FILTER_DISPLAY_NAMES = {
  mean_blur: "Blur (Média)",
  gaussian_blur: "Blur Gaussiano",
  median_blur: "Blur Mediana",
  canny: "Detecção de Bordas (Canny)",
  sobel: "Detecção de Bordas (Sobel)",
};

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalBase64, setOriginalBase64] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [filterHistory, setFilterHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kernelSize, setKernelSize] = useState(5);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result);
      setOriginalBase64(reader.result.split(',')[1]);
      setFilteredImage(null);
      setFilterHistory([]);
    };

    reader.readAsDataURL(file);
  };

  const resetFilter = () => {
    setFilteredImage(null);
    setFilterHistory([]);
  };

  const downloadImage = () => {
    if (!filteredImage) return;

    const link = document.createElement('a');
    link.href = filteredImage;
    link.download = "imagem_filtrada.png";
    link.click();
  };

  const getCurrentImageBase64 = () => {
    if (filteredImage) {
      return filteredImage.split(",")[1];
    }
    return originalBase64;
  };

  const applyFilter = async (filterName, requiresKernel) => {
    if (!originalBase64) {
      alert("Por favor, carregue uma imagem primeiro.");
      return;
    }

    setLoading(true);
    setFilteredImage(null);

    const payload = {
      image: getCurrentImageBase64(),
      ...(requiresKernel && { kernel_size: parseInt(kernelSize) }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/${filterName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.filtered_image) {
        setFilteredImage(`data:image/png;base64,${data.filtered_image}`);
        setFilterHistory(prev => [...prev, FILTER_DISPLAY_NAMES[filterName]]);
      } else {
        alert(`Erro ao aplicar o filtro: ${data.error || 'Resposta inválida do servidor.'}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API Flask:', error);
      alert('Falha ao conectar ao servidor Flask. Verifique se ele está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <h1 style={styles.header}>🎨 Teste de Filtros (React + Flask/OpenCV)</h1>

      <div style={styles.uploadSection}>
        <input 
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        <button 
          onClick={() => fileInputRef.current.click()}
          style={styles.uploadButton}
        >
          {originalImage ? 'Trocar Imagem' : '📷 Carregar Imagem'}
        </button>

        <label style={styles.kernelLabel}>
          Tamanho do Kernel (Ímpar):
          <input
            type="number"
            value={kernelSize}
            onChange={(e) => setKernelSize(e.target.value)}
            min="3"
            step="2"
            style={styles.kernelInput}
          />
        </label>
      </div>

      <div style={styles.filterSection}>
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => applyFilter(filter.key, filter.requiresKernel)}
            disabled={loading || !originalImage}
            style={styles.filterButton(filter.requiresKernel)}
          >
            {filter.name}
          </button>
        ))}

        <button
          onClick={resetFilter}
          disabled={!filteredImage}
          style={styles.resetButton}
        >
          🔄 Resetar Filtro
        </button>

        <button
          onClick={downloadImage}
          disabled={!filteredImage}
          style={styles.downloadButton}
        >
          ⬇️ Baixar Imagem
        </button>
      </div>

      <hr style={styles.separator} />

      <div style={styles.historyBox}>
        <h3>📜 Filtros aplicados:</h3>

        {filterHistory.length === 0 ? (
          <p>Nenhum filtro aplicado.</p>
        ) : (
          <p>{filterHistory.join(' → ')}</p>
        )}
      </div>

      <div style={styles.imageDisplay}>

        <div style={styles.imageContainer}>
          <h3 style={styles.imageTitle}>Original</h3>

          {originalImage ? (
            <img src={originalImage} alt="Original" style={styles.image} />
          ) : (
            <div style={styles.placeholder}>Aguardando Imagem...</div>
          )}
        </div>

        <div style={styles.imageContainer}>
          <h3 style={styles.imageTitle}>Processada</h3>

          {loading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
              <span style={{ marginTop: 15, fontSize: 16 }}>Aplicando filtro...</span>
            </div>
          )}

          {!loading && filteredImage ? (
            <img src={filteredImage} alt="Filtrada" style={styles.image} />
          ) : (
            !loading && (
              <div style={styles.placeholder}>Resultado do Filtro</div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 1200,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },

  header: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },

  uploadSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
    padding: 15,
    border: '1px solid #ddd',
    borderRadius: 8,
  },

  uploadButton: {
    padding: '10px 20px',
    fontSize: 16,
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
  },

  kernelLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

  kernelInput: {
    padding: 8,
    width: 60,
    borderRadius: 4,
    border: '1px solid #ccc',
    textAlign: 'center',
  },

  filterSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 30,
  },

  filterButton: (requiresKernel) => ({
    padding: '10px 15px',
    fontSize: 14,
    cursor: 'pointer',
    backgroundColor: requiresKernel ? '#007bff' : '#ffc107',
    color: requiresKernel ? '#fff' : '#333',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
    minWidth: 140,
  }),

  resetButton: {
    padding: '10px 15px',
    fontSize: 14,
    cursor: 'pointer',
    backgroundColor: '#6b6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
    minWidth: 140,
  },

  downloadButton: {
    padding: '10px 15px',
    fontSize: 14,
    cursor: 'pointer',
    backgroundColor: '#17b817',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
    minWidth: 160,
  },

  separator: {
    margin: '30px 0',
    borderTop: '1px solid #eee',
  },

  historyBox: {
    textAlign: 'center',
    padding: '12px 20px',
    margin: '20px auto',
    border: '1px solid #ddd',
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    maxWidth: 600,
    fontSize: 16,
  },

  imageDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 30,
  },

  imageContainer: {
    flex: 1,
    minHeight: 400,
    border: '2px dashed #ccc',
    borderRadius: 8,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },

  imageTitle: {
    margin: 12,
    color: '#555',
    fontWeight: 'bold',
  },

  image: {
    maxWidth: '100%',
    maxHeight: 'calc(100% - 40px)',
    objectFit: 'contain',
    padding: 10,
  },

  placeholder: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 18,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },

  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
};

export default App;