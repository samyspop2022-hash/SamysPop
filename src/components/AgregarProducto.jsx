import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './AgregarProducto.css';

export default function AgregarProducto({ onProductoAgregado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Franelas',
    descripcion: '',
    precio: '',
    stock: '',
    material: '',
    medida: 'S-M-L-XL',
    imagen: null
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const categorias = [
    "Llaveros",
    "Amigurumis",
    "Funko Pop",
    "Tazas",
    "Franelas"
  ];

  // Credenciales de Cloudinary
  const CLOUDINARY_CLOUD_NAME = 'djsiwt8s4';
  const CLOUDINARY_UPLOAD_PRESET = 'productos_samys';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      if (archivo.size > 5000000) {
        setError('La imagen no debe superar 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        imagen: archivo
      }));
      setError('');
    }
  };

  const subirImagenACloudinary = async (archivo) => {
    setSubiendoImagen(true);
    try {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append('file', archivo);
      formDataCloudinary.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formDataCloudinary.append('folder', 'samys-pop/productos');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataCloudinary
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir imagen a Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      if (!formData.nombre.trim()) {
        setError('El nombre es requerido');
        setCargando(false);
        return;
      }
      if (!formData.precio || formData.precio <= 0) {
        setError('El precio debe ser mayor a 0');
        setCargando(false);
        return;
      }
      if (!formData.stock || formData.stock < 0) {
        setError('El stock debe ser válido');
        setCargando(false);
        return;
      }
      if (!formData.imagen) {
        setError('Debes seleccionar una imagen');
        setCargando(false);
        return;
      }

      let imagenURL = '';

      if (formData.imagen) {
        imagenURL = await subirImagenACloudinary(formData.imagen);
      }

      await addDoc(collection(db, 'productos'), {
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        material: formData.material.trim(),
        medida: formData.medida,
        imagen: imagenURL,
        fechaCreacion: serverTimestamp()
      });

      setExito('¡Producto agregado exitosamente! 🎉');
      
      setFormData({
        nombre: '',
        categoria: 'Franelas',
        descripcion: '',
        precio: '',
        stock: '',
        material: '',
        medida: 'S-M-L-XL',
        imagen: null
      });

      document.getElementById('imagenInput').value = '';

      if (onProductoAgregado) {
        onProductoAgregado();
      }

      setTimeout(() => setExito(''), 3000);

    } catch (error) {
      console.error('Error al agregar producto:', error);
      setError('Error al agregar el producto. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="agregar-producto-container">
      <div className="agregar-producto-card">
        <h2>➕ Agregar Nuevo Producto</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Producto *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Franela Stitch Navideño"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio ($) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="15.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="100"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="Poliester / Algodón"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Medida</label>
            <input
              type="text"
              name="medida"
              value={formData.medida}
              onChange={handleChange}
              placeholder="S-M-L-XL"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada del producto..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Imagen *</label>
            <input
              id="imagenInput"
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              disabled={subiendoImagen}
              required
            />
            {formData.imagen && (
              <p className="file-info">✓ Archivo seleccionado: {formData.imagen.name}</p>
            )}
            {subiendoImagen && (
              <p className="file-info" style={{ color: '#2196F3', borderLeftColor: '#2196F3', background: 'rgba(33, 150, 243, 0.1)' }}>
                📤 Subiendo imagen a Cloudinary...
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={cargando || subiendoImagen}
            className="btn-agregar"
          >
            {cargando ? 'Agregando...' : subiendoImagen ? 'Subiendo imagen...' : 'Agregar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
