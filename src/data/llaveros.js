import luffy from '../assets/llaveros/luffy.jpg';
import pochacco from '../assets/llaveros/Pochacco.jpg';
import zorroMediano from '../assets/llaveros/zorro mediano.jpg';  // ← Agrega esta importación

export const llaveros = [
  {
    id: 1,
    nombre: "Llavero Luffy",
    precio: 8,
    categoria: "Llaveros",
    material: "Hilo 60% Algodón 40% Acrílico",
    medida: "10 cm",
    stock: 1,
    descripcion: "Llavero Amigurumi de Luffy tejido a mano con detalles precisos.",
    imagen: luffy,
  },

  {
    id: 2,
    nombre: "Llavero Pochacco",
    precio: 8,
    categoria: "Llaveros",
    material: "Hilo 60% Algodón 40% Acrílico",
    medida: "10 cm",
    stock: 1,
    descripcion: "Llavero de Pochacco, tierno y resistente.",
    imagen: pochacco,
  },

  {
    id: 3,
    nombre: "Llavero de Zorro",
    precio: 6,
    categoria: "Llaveros",
    material: "Hilo 60% Algodón 40% Acrílico",
    medida: "7 cm",
    stock: 1,
    descripcion: "Llavero de Zorro, tierno y resistente.",
    imagen: zorroMediano, 
  },
];