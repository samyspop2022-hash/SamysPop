import hebreos1010 from '../assets/tazas/hebreos1010.jpg';
import juan146 from '../assets/tazas/juan146.jpg';
import isaias4110 from '../assets/tazas/isaias4110.jpg';
import proverbios3110 from '../assets/tazas/proverbios3110.jpg';
import juan48 from '../assets/tazas/juan48.jpg';
import apocalipsis1978 from '../assets/tazas/apocalipsis1978.jpg';
import filipenses48 from '../assets/tazas/filipenses48.jpg';
import josue19 from '../assets/tazas/josue19.jpg';
import MT72425 from '../assets/tazas/MT72425.jpg';
import cancionromantica from '../assets/tazas/cancionromantica.png';
import estrellita from '../assets/tazas/estrellita.png';



const crearTaza = (id, nombre, precio, stock, descripcion, imagen, tipo = "Cerámica Sublimada") => ({
  id,
  nombre,
  precio,
  categoria: "Tazas",
  material: "Cerámica",
  medida: "11 oz",
  stock,
  descripcion,
  imagen,
  tipo, // "Cerámica Sublimada" o "Cerámica Sublimada con Cristales"
});

export const tazas = [
  crearTaza(1, "Taza Personalizada Hebreos 10:10", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", hebreos1010),
  crearTaza(2, "Taza Personalizada Juan 14:6", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", juan146),
  crearTaza(3, "Taza Personalizada Isaías 41:10", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", isaias4110),
  crearTaza(4, "Taza Personalizada Proverbios 31:10", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", proverbios3110),
  crearTaza(5, "Taza Personalizada Juan 4:8", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", juan48),
  crearTaza(6, "Taza Personalizada Apocalipsis 19:7-8", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", apocalipsis1978),
  crearTaza(7, "Taza Personalizada Filipenses 4:8", 7, 1000, "Taza de cerámica sublimada, Se puede incluir tu nombre.", filipenses48),
  crearTaza(8, "Taza Personalizada Josue 1:9", 7, 1000, "Taza de cerámica sublimada,Se puede incluir tu nombre.", josue19),
  crearTaza(9, "Taza Personalizada Mt 7:24-25", 7, 1000, "Taza de cerámica sublimada,Se puede incluir tu nombre.", MT72425),
  crearTaza(10, "Taza Flork Canción Romantica", 7, 1000, "Taza de cerámica sublimada,Se puede incluir tu nombre.", cancionromantica),
  crearTaza(11, "Taza Flork Eres Mi Estrellita", 7, 1000, "Taza de cerámica sublimada,Se puede incluir tu nombre.", estrellita),
  
];