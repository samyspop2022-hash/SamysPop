import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

import miLogo from './assets/logo.png';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash, FaTruck, FaMotorcycle, FaStore, FaPaypal, FaWallet, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import img1 from './assets/luffy.jpg';
import img2 from './assets/Pochacco.jpg';
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', cedula: '', direccion: '' });
  
  const [metodoEnvio, setMetodoEnvio] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [zonaYummy, setZonaYummy] = useState('Barcelona'); 

  const productos = [
    { id: 1, nombre: "Llavero Luffy", precio: 8.0, categoria: "Llaveros", material: "Hilo Algodón", medida: "10 cm", stock: 1, descripcion: "Llavero Amigurumi de Luffy tejido a mano con detalles precisos.", imagen: img1 },
    { id: 2, nombre: "Llavero Pochacco", precio: 8.0, categoria: "Llaveros", material: "Hilo Algodón", medida: "10 cm", stock: 3, descripcion: "Llavero de Pochacco, tierno y resistente.", imagen: img2 },
    { id: 3, nombre: "Amigurumi Oso", precio: 15.0, categoria: "Amigurumis", material: "Lana Soft", medida: "20 cm", stock: 2, descripcion: "Peluche de oso muy suave, ideal para regalo.", imagen: img1 },
  ];

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  const getTarifaYummy = () => {
    switch(zonaYummy) {
      case 'Barcelona': return 3.00;
      case 'Lechería': return 4.50;
      case 'Guanta': return 6.00;
      default: return 0;
    }
  };

  const agregarAlCarrito = (p, cant) => {
    const nuevosItems = Array(cant).fill(p);
    setCarrito([...carrito, ...nuevosItems]);
    setProductoSeleccionado(null);
  };

  const eliminarDelCarrito = (index) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };
  
  const confirmarPedido = async () => {
  if (!formData.nombre || !formData.whatsapp || !metodoEnvio || !metodoPago) {
    alert("Por favor completa todos los campos.");
    return;
  }

  let costoExtra = metodoEnvio === 'Envío Nacional- Cobro en Destino' ? 1 : 0;
  
  try {
    await addDoc(collection(db, "pedidos"), {
      usuario: formData,
      productos: carrito.map(p => p.nombre),
      total: calcularTotalFinal().toFixed(2),
      envio: metodoEnvio === 'Delivery Yummy' ? `Delivery Yummy - ${zonaYummy}` : metodoEnvio,
      pago: metodoPago,
      fecha: new Date().toLocaleString()
    });

    // 2. Crear mensaje para WhatsApp
    const mensaje = `¡Hola! Acabo de realizar una compra en Samys Pop%0A%0A` +
      `Productos: ${carrito.map(p => p.nombre).join(', ')}%0A` +
      `Envío: ${metodoEnvio === 'Delivery Yummy' ? 'Delivery Yummy (' + zonaYummy + ')' : metodoEnvio}%0A` +
      `Total a pagar: $${calcularTotalFinal().toFixed(2)}%0A%0A` +
      `Método de Pago: ${metodoPago}%0A%0A` +
      `Datos para la entrega:%0A` +
      `Nombre: ${formData.nombre}%0A` +
      `C.I.: ${formData.cedula}%0A` +
      `Teléfono: ${formData.whatsapp}%0A` +
      `Dirección: ${formData.direccion}%0A%0A` +
      `Confirma mi pedido y el comprobante de pago. ¡Gracias!`;

    // 3. Abrir WhatsApp (Reemplaza con tu número de teléfono, ej: 58412XXXXXXX)
    const telefonoNegocio = "584220327576"; 
    window.open(`https://wa.me/${telefonoNegocio}?text=${mensaje}`, '_blank');

    alert("¡Pedido realizado con éxito!");
    setCarrito([]);
    setCheckoutAbierto(false);
  } catch (e) { 
    alert("Error al guardar el pedido"); 
  }
};

 const calcularTotalFinal = () => {
  const costoAdministrativo = metodoEnvio === 'Envío Nacional- Cobro en Destino' ? 1 : 0;
  return total + costoAdministrativo;
};

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Urbanist, sans-serif', backgroundColor: '#1a1a1a', color: '#ffffff', minHeight: '100vh' }}>
      
      <div onClick={() => setCarritoAbierto(true)} style={{ position: 'absolute', top: '30px', right: '30px', fontSize: '24px', cursor: 'pointer', color: '#ff69b4' }}>
        <FaShoppingCart />
        {carrito.length > 0 && <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff69b4', fontSize: '10px', borderRadius: '50%', padding: '2px 6px' }}>{carrito.length}</span>}
      </div>

      <img src={miLogo} alt="Logo" style={{ width: '120px', marginBottom: '20px' }} />
      <h1>Bienvenidos a Samys Pop!</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {productos.map(p => (
          <div key={p.id} onClick={() => { setProductoSeleccionado(p); setCantidad(1); }} style={{ backgroundColor: '#262626', padding: '20px', borderRadius: '20px', width: '200px', cursor: 'pointer' }}>
            <img src={p.imagen} style={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: '10px' }} />
            <h3>{p.nombre}</h3>
            <p style={{ color: '#ff69b4', fontWeight: 'bold' }}>${p.precio.toFixed(2)}</p>
          </div>
        ))}
      </div>

{productoSeleccionado && (
  <div className="overlay-modal">
    <div className="modal-container">
      
      <FaTimes 
        onClick={() => setProductoSeleccionado(null)} 
        className="close-icon" 
      />
      
      <img 
        src={productoSeleccionado.imagen} 
        className="modal-product-image" 
        alt={productoSeleccionado.nombre} 
      />

      <div className="modal-content">
        <h2>{productoSeleccionado.nombre}</h2>
        <p className="category">{productoSeleccionado.categoria}</p>
        <p className="stock">● En stock ({productoSeleccionado.stock})</p>
        
        <div className="specs-container">
          <div className="spec-box"><small>Material</small><br/><strong>{productoSeleccionado.material}</strong></div>
          <div className="spec-box"><small>Medida</small><br/><strong>{productoSeleccionado.medida}</strong></div>
        </div>
        
        <p className="description">{productoSeleccionado.descripcion}</p>
        
        {/* Validación: Si precio no existe, que no rompa la app */}
        <h2 className="price">${productoSeleccionado.precio ? productoSeleccionado.precio.toFixed(2) : "0.00"}</h2>
        
        <div className="counter-container">
          <button onClick={() => setCantidad(prev => Math.max(1, prev - 1))}><FaMinus /></button>
          <span>{cantidad}</span>
          <button onClick={() => setCantidad(prev => Math.min(productoSeleccionado.stock, prev + 1))}><FaPlus /></button>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={() => {
             agregarAlCarrito(productoSeleccionado, cantidad);
             setProductoSeleccionado(null); // Opcional: cierra el modal tras añadir
          }} 
          disabled={productoSeleccionado.stock === 0}
        >
          {productoSeleccionado.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Carrito Abierto */}
      {carritoAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ background: '#000', padding: '30px', borderRadius: '35px', border: '2px solid #ff69b4', width: '90%', maxWidth: '400px', color: 'white', position: 'relative' }}>
            <FaTimes onClick={() => setCarritoAbierto(false)} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: '#ff69b4', fontSize: '20px' }} />
            <h2>Tu carrito</h2>
            {carrito.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>{item.nombre}</span>
                <span>${item.precio.toFixed(2)} <FaTrash onClick={() => eliminarDelCarrito(index)} style={{ cursor: 'pointer', color: '#ff69b4', marginLeft: '10px' }} /></span>
              </div>
            ))}
            <h3>Total: ${total.toFixed(2)}</h3>
            <button 
  onClick={() => { 
    if (carrito.length === 0) {
      setCarritoAbierto(false);
    } else {
      setCarritoAbierto(false); 
      setCheckoutAbierto(true); 
    }
  }} 
  style={{ 
    width: '100%', 
    padding: '15px', 
    background: carrito.length === 0 ? '#444' : '#ff69b4', 
    borderRadius: '20px', 
    border: 'none', 
    color: 'white', 
    cursor: carrito.length === 0 ? 'default' : 'pointer' 
  }}
>
  {carrito.length === 0 ? 'Volver a productos' : 'Continuar al checkout'}
</button>
          </div>
        </div>
      )}

      {/* Checkout */}
      {checkoutAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 4000 }}>
          <div style={{ background: '#000', padding: '30px', borderRadius: '25px', border: '2px solid #ff69b4', width: '90%', maxWidth: '450px', maxHeight: '85vh', overflowY: 'auto', color: 'white', position: 'relative' }}>
            <FaTimes onClick={() => setCheckoutAbierto(false)} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: '#ff69b4', fontSize: '24px' }} />
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Finalizar pedido</h2>
            
            {[ { key: 'nombre', placeholder: 'Nombre completo' }, { key: 'whatsapp', placeholder: 'WhatsApp' }, { key: 'cedula', placeholder: 'Cédula' }, { key: 'direccion', placeholder: 'Dirección (opcional)' } ].map(field => (
              <input key={field.key} placeholder={field.placeholder} value={formData[field.key] || ''} onChange={(e) => setFormData({...formData, [field.key]: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #444', background: '#1a1a1a', color: 'white', boxSizing: 'border-box' }} />
            ))}

            <h3 style={{ marginTop: '20px' }}>Método de envío</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[ {n: 'Envío Nacional- Cobro en Destino', i: <FaTruck />}, {n: 'Delivery Yummy', i: <FaMotorcycle />}, {n: 'Retiro en Tienda', i: <FaStore />} ].map(m => (
                <div key={m.n} onClick={() => setMetodoEnvio(m.n)} style={{ border: metodoEnvio === m.n ? '2px solid #ff69b4' : '1px solid #555', padding: '10px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '12px' }}>{m.i}<br/>{m.n}</div>
              ))}
            </div>

            {metodoEnvio === 'Delivery Yummy' && (
              <div style={{ marginTop: '15px', padding: '15px', border: '1px solid #ff69b4', borderRadius: '15px', backgroundColor: '#111' }}>
                <p style={{ fontSize: '14px', marginBottom: '10px', color: '#ff69b4', fontWeight: 'bold' }}>Tarifas aproximadas:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px', marginBottom: '15px' }}>
                  <span>Barcelona:</span> <strong>2$ - 4$</strong><span>Lechería:</span> <strong>4$ - 5$</strong><span>Guanta:</span> <strong>5.50$ - 6.50$</strong>
                </div>
                <select value={zonaYummy} onChange={(e) => setZonaYummy(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#262626', color: 'white', border: '1px solid #555', cursor: 'pointer' }}>
                  <option value="Barcelona">Barcelona</option><option value="Lechería">Lechería</option><option value="Guanta">Guanta</option>
                </select>
              </div>
            )}

            {metodoEnvio === 'Envío Nacional- Cobro en Destino' && (
              <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ff69b4', borderRadius: '10px' }}>
                <p style={{ fontSize: '12px', color: '#ff69b4', margin: '0 0 10px 0' }}>Nota: Se cobrará 1$ adicional por gastos administrativos.</p>
                <input placeholder="Código de agencia" style={{ width: '100%', margin: '5px 0', padding: '5px', borderRadius: '5px', background: '#262626', border: '1px solid #555', color: 'white' }} />
                <input placeholder="Ciudad" style={{ width: '100%', margin: '5px 0', padding: '5px', borderRadius: '5px', background: '#262626', border: '1px solid #555', color: 'white' }} />
                <input placeholder="Estado" style={{ width: '100%', margin: '5px 0', padding: '5px', borderRadius: '5px', background: '#262626', border: '1px solid #555', color: 'white' }} />
              </div>
            )}

            <h3 style={{ marginTop: '20px' }}>Método de pago</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[ {n: 'PayPal', i: <FaPaypal />}, {n: 'Binance', i: <FaWallet />}, {n: 'Pago Móvil', i: <FaUniversity />}, {n: 'Efectivo', i: <FaMoneyBillWave />} ].map(m => (
                <div key={m.n} onClick={() => setMetodoPago(m.n)} style={{ border: metodoPago === m.n ? '2px solid #ff69b4' : '1px solid #555', padding: '10px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '12px' }}>{m.i}<br/>{m.n}</div>
              ))}
            </div>

            {metodoPago === 'PayPal' && (
              <div style={{ marginTop: '15px', padding: '15px', background: '#1a1a1a', borderRadius: '15px', textAlign: 'center', border: '1px solid #ff69b4' }}>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Paga directamente con PayPal:</p>
                <a href="https://paypal.me/electrobebe" target="_blank" rel="noopener noreferrer" style={{ display: 'block', backgroundColor: '#ffc439', color: '#003087', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', border: 'none' }}>Pay with <span style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic', fontWeight: 'bold' }}>PayPal</span></a>
              </div>
            )}
            {metodoPago === 'Binance' && (
  <div style={{ marginTop: '15px', padding: '15px', background: '#1a1a1a', borderRadius: '15px', textAlign: 'center', border: '1px solid #ff69b4', color: 'white' }}>
    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Datos para transferir por Binance:</p>
    <div style={{ textAlign: 'left', fontSize: '13px', lineHeight: '1.6' }}>
      <p style={{ margin: '2px 0' }}><strong>Nombre:</strong> Samira Hernández</p>
      <p style={{ margin: '2px 0' }}><strong>ID (Pay ID):</strong> 214047071</p>
      <p style={{ margin: '2px 0' }}><strong>Correo:</strong> saminh26@gmail.com</p>
    </div>
  </div>
)}
{metodoPago === 'Pago Móvil' && (
  <div style={{ marginTop: '15px', padding: '15px', background: '#1a1a1a', borderRadius: '15px', textAlign: 'center', border: '1px solid #ff69b4', color: 'white' }}>
    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Datos para Pago Móvil:</p>
    <div style={{ textAlign: 'left', fontSize: '13px', lineHeight: '1.6' }}>
      <p style={{ margin: '2px 0' }}><strong>Banco:</strong> Banplus (0174)</p>
      <p style={{ margin: '2px 0' }}><strong>Nro de tlf:</strong> 04220327576</p>
      <p style={{ margin: '2px 0' }}><strong>C.I:</strong> V- 23.518.328</p>
    </div>
  </div>
)}

            <div style={{ marginTop: '20px', padding: '15px', background: '#262626', borderRadius: '15px', fontSize: '14px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
    <span>Subtotal productos:</span>
    <span>${total.toFixed(2)}</span>
  </div>
{(calcularTotalFinal() - total) > 0 && (
  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff69b4', marginBottom: '10px' }}>
    <span>{metodoEnvio === 'Delivery Yummy' ? 'Costo de Delivery:' : 'Gastos adm/envío:'}</span>
    <span>${(calcularTotalFinal() - total).toFixed(2)}</span>
  </div>
)} 
  <hr style={{ border: '0', borderTop: '1px solid #444', margin: '10px 0' }} />
  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
    <span>Total a pagar:</span>
    <span>${calcularTotalFinal().toFixed(2)}</span>
  </div>
</div>
            <button onClick={confirmarPedido} style={{ width: '100%', padding: '15px', background: '#ff69b4', color: 'white', marginTop: '20px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Confirmar pedido</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;