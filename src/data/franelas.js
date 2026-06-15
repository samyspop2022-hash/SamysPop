import navidad1 from '../assets/franelas/navidad1.png';
import stitch from '../assets/franelas/stitch.png';
import navidad2 from '../assets/franelas/navidad2.png';
import navidad3 from '../assets/franelas/navidad3.png';

const crearFranela = (id, nombre, precio, stock, descripcion, imagen, materialesDisponibles = ["Poliester"], medida = "S-M-L-XL") => ({
  id,
  nombre,
  precio,
  categoria: "Franelas",
  material: materialesDisponibles.join(" / "), // Convertir array a string
  medida,
  stock,
  descripcion,
  imagen,
});

export const franelas = [
  crearFranela(1, "Franela StarWars Navideño", 15, 1000, "Franela sublimada de alta calidad con diseño exclusivo de Star Wars en tema navideño. Perfecta para regalos y uso casual.", navidad1, ["Poliester", "Microdurazno"], "S-M-L-XL"),
  crearFranela(2, "Franela Stich Navideño", 15, 1000, "Franela sublimada de alta calidad con diseño exclusivo de Stitch en tema navideño. Perfecta para regalos y uso casual.", stitch, ["Poliester", "Microdurazno"], "S-M-L-XL"),
  crearFranela(3, "Franela Minnie y Mickey Navideño", 15, 1000, "Franela sublimada de alta calidad con diseño exclusivo de Minnie y Mickey en tema navideño. Perfecta para regalos y uso casual.", navidad2, ["Poliester", "Microdurazno"], "S-M-L-XL"),
  crearFranela(4, "Franela Toy Story Navideño", 15, 1000, "Franela sublimada de alta calidad con diseño exclusivo de Toy Story en tema navideño. Perfecta para regalos y uso casual.", navidad3, ["Poliester", "Microdurazno"], "S-M-L-XL"),

];