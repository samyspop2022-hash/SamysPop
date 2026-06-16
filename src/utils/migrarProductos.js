import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';

// Importar todos los productos
import { llaveros } from '../data/llaveros';
import { amigurumis } from '../data/amigurumis';
import { funkos } from '../data/funkos';
import { tazas } from '../data/tazas';
import { franelas } from '../data/franelas';

// Todos los productos combinados
const todosLosProductos = [
  ...llaveros,
  ...amigurumis,
  ...funkos,
  ...tazas,
  ...franelas
];

export const migrarProductos = async () => {
  console.log(`📦 Iniciando migración de ${todosLosProductos.length} productos...`);

  let productosSubidos = 0;
  let errores = 0;

  for (const producto of todosLosProductos) {
    try {
      console.log(`⏳ Subiendo: ${producto.nombre}...`);

      // Usar la imagen directamente (es un import de React)
      const urlImagen = producto.imagen;

      // Guardar en Firestore
      await addDoc(collection(db, "productos"), {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        material: producto.material,
        medida: producto.medida,
        stock: producto.stock,
        descripcion: producto.descripcion,
        imagen: urlImagen, // URL local de la imagen
        fechaCreacion: new Date()
      });

      productosSubidos++;
      console.log(`✅ ${producto.nombre} subido correctamente`);
    } catch (error) {
      errores++;
      console.error(`❌ Error con ${producto.nombre}:`, error);
    }

    // Pequeña pausa entre uploads
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`
    ╔════════════════════════════════════╗
    ║ 🎉 MIGRACIÓN COMPLETADA 🎉        ║
    ╠════════════════════════════════════╣
    ║ ✅ Productos subidos: ${productosSubidos}        
    ║ ❌ Errores: ${errores}              
    ╚════════════════════════════════════╝
  `);

  return { productosSubidos, errores };
};