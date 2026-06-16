import { useState } from 'react';
import { migrarProductos } from '../utils/migrarProductos';

function MigrarDatos() {
  const [migrando, setMigrando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleMigrar = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro? Esto va a subir TODOS los productos a Firestore. ¿Continuar?')) {
      return;
    }

    setMigrando(true);
    setResultado(null);

    try {
      const res = await migrarProductos();
      setResultado(res);
      alert(`✅ Migración completada!\n✅ Subidos: ${res.productosSubidos}\n❌ Errores: ${res.errores}`);
    } catch (error) {
      console.error("Error en migración:", error);
      alert("❌ Error durante la migración. Revisa la consola.");
    } finally {
      setMigrando(false);
    }
  };

  return (
    <div style={{
      padding: '30px',
      background: '#1a1a1a',
      color: '#fff',
      borderRadius: '15px',
      maxWidth: '600px',
      margin: '20px auto',
      border: '2px solid #ff69b4',
      textAlign: 'center'
    }}>
      <h2>🔄 Migrar Productos a Firestore</h2>
      <p style={{ color: '#999', marginBottom: '20px' }}>
        Esto va a subir todas tus imágenes a Cloudinary y los datos a Firestore.
      </p>

      <button
        onClick={handleMigrar}
        disabled={migrando}
        style={{
          padding: '15px 30px',
          background: migrando ? '#999' : '#ff69b4',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: migrando ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {migrando ? '⏳ Migrando... (no cierres esta página)' : '🚀 Iniciar Migración'}
      </button>

      {resultado && (
        <div style={{
          background: '#262626',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#4caf50', fontSize: '18px', fontWeight: 'bold' }}>
            ✅ Productos subidos: {resultado.productosSubidos}
          </p>
          {resultado.errores > 0 && (
            <p style={{ color: '#ff4444', fontSize: '18px', fontWeight: 'bold' }}>
              ❌ Errores: {resultado.errores}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MigrarDatos;