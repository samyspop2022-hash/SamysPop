import { db, auth } from './firebase';
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import AgregarProducto from './components/AgregarProducto';

import miLogo from './assets/logo.png';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash, FaTruck, FaMotorcycle, FaStore, FaPaypal, FaWallet, FaUniversity, FaMoneyBillWave, FaCog } from 'react-icons/fa';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', cedula: '', direccion: '' });
  
  const [metodoEnvio, setMetodoEnvio] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [zonaYummy, setZonaYummy] = useState('Barcelona'); 
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const [tasaBCV, setTasaBCV] = useState(585.50);
  
  // NUEVAS VARIABLES PARA EL ADMIN
const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);
const [adminAutenticado, setAdminAutenticado] = useState(false);
const [mostrarFormularioProductos, setMostrarFormularioProductos] = useState(false);
const [usuarioAdmin, setUsuarioAdmin] = useState(null);

const ADMIN_EMAIL = "saminh_26@gmail.com";
const googleProvider = new GoogleAuthProvider();

// Verificar si el usuario está logueado y es el admin
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user && user.email === ADMIN_EMAIL) {
      setAdminAutenticado(true);
      setUsuarioAdmin(user);
      
      // Guardar log de acceso exitoso
      addDoc(collection(db, "admin_logs"), {
        timestamp: new Date(),
        estado: "exitoso",
        email: user.email,
        tipo: "login"
      });
    } else {
      setAdminAutenticado(false);
      setUsuarioAdmin(null);
    }
  });
  
  return unsubscribe;
}, []);

// Función para iniciar sesión con Google
const iniciarSesionAdmin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (user.email === ADMIN_EMAIL) {
      setMostrarModalAdmin(false);
    } else {
      // Guardar intento fallido
      await addDoc(collection(db, "admin_logs"), {
        timestamp: new Date(),
        estado: "fallido",
        email: user.email,
        razon: "correo no autorizado"
      });
      
      alert("❌ Este correo no tiene permisos de admin");
      await signOut(auth);
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error al iniciar sesión con Google");
  }
};

// Función para cerrar sesión
const cerrarSesionAdmin = async () => {
  try {
    await signOut(auth);
    setAdminAutenticado(false);
    setMostrarFormularioProductos(false);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
  const productosPorPagina = 12;
  
  const categorias = [
    "Todos",
    "Llaveros",
    "Amigurumis",
    "Funko Pop",
    "Tazas",
    "Franelas"
  ];

  // Cargar productos desde Firestore
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const q = query(collection(db, "productos"));
        const querySnapshot = await getDocs(q);
        const productosArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        productosArray.sort((a, b) => 
          (b.fechaCreacion?.toDate?.() || 0) - (a.fechaCreacion?.toDate?.() || 0)
        );
        setProductos(productosArray);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    cargarProductos();
  }, []);

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  // Obtener tasa BCV
  useEffect(() => {
    const obtenerTasaDesdeSheet = async () => {
      try {
        const sheetId = "1mP2xl01u-NfxqdgXYhlcK0f3YvkcrJcWYANPhsbSjK0"; 
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tq=select%20B&range=B1`;
        
        const response = await fetch(url);
        const text = await response.text();
       
        const json = JSON.parse(text.substring(47, text.length - 2));
        const valor = json.table.rows[0].c[0].v;
        
        setTasaBCV(valor);
        console.log("Tasa BCV actualizada desde Sheet:", valor);
      } catch (error) {
        console.error("No se pudo obtener la tasa, usando valor predeterminado", error);
      }
    };

    obtenerTasaDesdeSheet();
  }, []);

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

  const productosFiltrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Poppins, sans-serif', backgroundColor: '#1a1a1a', color: '#ffffff', minHeight: '100vh' }}>
      
      {/* BOTÓN ADMIN DISCRETO EN LA ESQUINA SUPERIOR DERECHA */}
      {!adminAutenticado && (
  <button
    onClick={() => setMostrarModalAdmin(true)}
    style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'transparent',
      border: 'none',
      color: '#888888',
      fontSize: '8px',
      cursor: 'pointer',
      padding: '2px',
      borderRadius: '50%',
      zIndex: 999,
      opacity: 0.4
    }}
  >
    ⚙️
  </button>
)}


      {/* MODAL DE LOGIN CON GOOGLE */}
{mostrarModalAdmin && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000 }}>
    <div style={{ background: '#000', padding: '40px', borderRadius: '20px', border: '2px solid #ff69b4', width: '90%', maxWidth: '350px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', color: '#ff69b4' }}>🔐 Acceso Admin</h2>
      <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>Inicia sesión con tu cuenta de Google para acceder a admin</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={iniciarSesionAdmin}
          style={{
            flex: 1,
            padding: '12px',
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          🔑 Google Login
        </button>
        <button
          onClick={() => setMostrarModalAdmin(false)}
          style={{
            flex: 1,
            padding: '12px',
            background: '#333',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

      {/* BOTÓN Y COMPONENTE AGREGAR PRODUCTO - SOLO SI ESTÁ AUTENTICADO */}
      {adminAutenticado && mostrarFormularioProductos && <AgregarProducto />}

      {adminAutenticado && !mostrarFormularioProductos && (
        <button 
          onClick={() => setMostrarFormularioProductos(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, #ff69b4, #ff4fa8)',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 20px rgba(255, 105, 180, 0.3)',
            zIndex: 999,
            transition: 'all 0.3s ease'
          }}
        >
          ➕ Agregar Producto
        </button>
      )}

      {adminAutenticado && mostrarFormularioProductos && (
        <button 
          onClick={() => setMostrarFormularioProductos(false)}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 20px rgba(255, 105, 180, 0.3)',
            zIndex: 999
          }}
        >
          ← Volver a Productos
        </button>
      )}

      {adminAutenticado && (
  <button
    onClick={cerrarSesionAdmin}
    style={{
      position: 'fixed',
      top: '20px',
      right: '70px',
      background: '#ff69b4',
      border: 'none',
      color: 'white',
      fontSize: '12px',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '20px',
      zIndex: 999,
      fontWeight: 'bold'
    }}
  >
    🚪 Salir Admin
  </button>
)}

      <div onClick={() => setCarritoAbierto(true)} style={{ position: 'fixed', top: '20px', right: '20px', fontSize: '32px', cursor: 'pointer', color: '#ff69b4', zIndex: 1000, transition: 'all 0.3s ease' }} className="carrito-icon">
        <FaShoppingCart />
        {carrito.length > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-12px', 
            background: 'linear-gradient(135deg, #ff69b4, #ff4fa8)',
            color: 'white',
            fontSize: '13px', 
            borderRadius: '50%', 
            padding: '4px 8px',
            fontWeight: 'bold',
            border: '2px solid #000',
            boxShadow: '0 0 10px rgba(255, 105, 180, 0.6)',
            minWidth: '24px',
            textAlign: 'center'
          }}>
            {carrito.length}
          </span>
        )}
      </div>

      <div style={{
        background: '#262626',
        color: '#fff',
        padding: '10px',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        🇻🇪 Tasa BCV: Bs. {tasaBCV}
      </div>

      <div className="hero-banner">
        <img src={miLogo} alt="Logo" className="logo-principal" />
        <h1 className="titulo-principal">¡Bienvenidos a Samy's Pop!</h1>
        <p className="slogan">Regalos Únicos, Recuerdos para Siempre</p>
        <div className="envios">
          <FaTruck color="#ff69b4" />
          <span>Envíos a toda Venezuela</span>
        </div>

        <div className="categorias">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={categoriaActiva === cat ? "categoria-btn activa" : "categoria-btn"}
              onClick={() => {
                setCategoriaActiva(cat);
                setPaginaActual(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {productosPaginados.map(p => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => {
              setProductoSeleccionado(p);
              setCantidad(1);
            }}
          >
            <img src={p.imagen} className="product-image" alt={p.nombre} />
            <h3 className="product-name">{p.nombre}</h3>
            <p className="product-price">${p.precio.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => {
                setPaginaActual(page);
                window.scrollTo(0, 0);
              }}
              style={{
                padding: '10px 15px',
                background: paginaActual === page ? '#ff69b4' : '#262626',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: paginaActual === page ? 'bold' : 'normal'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <div className="overlay-modal">
          <div className="modal-container">
            <FaTimes onClick={() => setProductoSeleccionado(null)} className="close-icon" />
            <img src={productoSeleccionado.imagen} className="modal-product-image" alt={productoSeleccionado.nombre} />

            <div className="modal-content">
              <h2>{productoSeleccionado.nombre}</h2>
              <p className="category">{productoSeleccionado.categoria}</p>
              <div className="price-stock-row">
                <p className="stock" style={{ color: productoSeleccionado.stock > 0 ? '#4caf50' : '#ff4444', fontWeight: 'bold' }}>
                  {productoSeleccionado.stock > 0 ? `● En stock (${productoSeleccionado.stock})` : '● Agotado'}
                </p>
              </div>
              
              <div className="specs-container">
                <div className="spec-box"><small>Material</small><br/><strong>{productoSeleccionado.material}</strong></div>
                <div className="spec-box"><small>Medida</small><br/><strong>{productoSeleccionado.medida}</strong></div>
              </div>
              
              <p className="description">{productoSeleccionado.descripcion}</p>
              <h2 className="price">${productoSeleccionado.precio ? productoSeleccionado.precio.toFixed(2) : "0.00"}</h2>
              
              <div className="counter-container">
                <button onClick={() => setCantidad(prev => Math.max(1, prev - 1))}><FaMinus /></button>
                <span>{cantidad}</span>
                <button onClick={() => setCantidad(prev => Math.min(productoSeleccionado.stock, prev + 1))}><FaPlus /></button>
              </div>
              
              <button 
                className="add-to-cart-btn"
                style={{ 
                  backgroundColor: productoSeleccionado.stock > 0 ? '#ff69b4' : '#333',
                  cursor: productoSeleccionado.stock > 0 ? 'pointer' : 'not-allowed'
                }}
                onClick={() => {
                  agregarAlCarrito(productoSeleccionado, cantidad);
                  setProductoSeleccionado(null);
                }} 
                disabled={productoSeleccionado.stock === 0}
              >
                {productoSeleccionado.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {carritoAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ background: '#000', padding: '30px', borderRadius: '35px', border: '2px solid #ff69b4', width: '90%', maxWidth: '400px', maxHeight: '85vh', overflowY: 'auto', color: 'white', position: 'relative' }}>
            <FaTimes onClick={() => setCarritoAbierto(false)} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: '#ff69b4', fontSize: '20px' }} />
            <h2 style={{ marginBottom: '20px' }}>Tu carrito</h2>
            {carrito.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>Tu carrito está vacío</p>
            ) : (
              <>
                {Array.from(
                  carrito.reduce((acc, item) => {
                    if (!acc.has(item.id)) {
                      acc.set(item.id, { producto: item, cantidad: 0 });
                    }
                    acc.get(item.id).cantidad += 1;
                    return acc;
                  }, new Map()).values()
                ).map((group) => (
                  <div key={group.producto.id} className="modal-carrito-item">
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '5px', wordBreak: 'break-word' }}>
                        {group.producto.nombre}
                      </span>
                      <p style={{ margin: '0', color: '#ff69b4', fontSize: '12px' }}>
                        Cantidad: <strong>{group.cantidad}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ whiteSpace: 'nowrap' }}>${(group.producto.precio * group.cantidad).toFixed(2)}</span>
                      <FaTrash 
                        onClick={() => {
                          const newCarrito = carrito.filter(item => item.id !== group.producto.id);
                          setCarrito(newCarrito);
                        }} 
                        style={{ cursor: 'pointer', color: '#ff69b4', flexShrink: 0 }} 
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
            <h3 style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px', textAlign: 'center' }}>Total: ${total.toFixed(2)}</h3>
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
                cursor: carrito.length === 0 ? 'default' : 'pointer',
                marginTop: '15px',
                fontWeight: 'bold'
              }}
            >
              {carrito.length === 0 ? 'Volver a productos' : 'Continuar al checkout'}
            </button>
          </div>
        </div>
      )}

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

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
                <span>Total Dolares:</span>
                <span>${calcularTotalFinal().toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
                <span>Total Bs:</span>
                <span>Bs. {(calcularTotalFinal() * tasaBCV).toFixed(2)}</span>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#1a1a1a', borderRadius: '15px', border: '1px solid #ff69b4', textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: '13px', color: '#ff69b4', fontWeight: 'bold' }}>
                  📸 Toma una captura de tu comprobante de pago y envíalo por WhatsApp
                </p>
              </div>

              <button 
                onClick={confirmarPedido} 
                style={{ width: '100%', padding: '15px', background: '#ff69b4', color: 'white', marginTop: '15px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px' }}
              >
                📞 Confirmar pedido y enviar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;