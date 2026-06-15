import luffy from '../assets/llaveros/luffy.jpg';
import pochacco from '../assets/llaveros/Pochacco.jpg';
import zorroMediano from '../assets/llaveros/zorro mediano.jpg';
import patocongorroderana from '../assets/llaveros/pato con gorro de rana.jpg';
import llaveroperritopug from '../assets/llaveros/llavero perrito pug.jpg';
import capibara from '../assets/llaveros/capibara.jpg';
import pikachu from '../assets/llaveros/pikachu.jpg';
import pluton from '../assets/llaveros/pluton.jpg';
import pinguinolila from '../assets/llaveros/pinguinolila.jpg';
import kirby from '../assets/llaveros/kirby.jpg';
import gato from '../assets/llaveros/gato.jpg';
import yoshi from '../assets/llaveros/yoshi.jpg';
import osito from '../assets/llaveros/osito.jpg';
import cinnamoroll from '../assets/llaveros/cinnamoroll.jpg';
import wolverine from '../assets/llaveros/wolverine.jpg';
import deadpool from '../assets/llaveros/deadpool.jpg';
import ballenita from '../assets/llaveros/ballenita.jpg';
import chanchoconoverol from '../assets/llaveros/chanchoconoverol.jpg';
import miniconejo from '../assets/llaveros/miniconejo.jpg';
import pinguinorosa from '../assets/llaveros/pinguinorosa.jpg';
import hongoverde from '../assets/llaveros/hongoverde.jpg';
import snoopy from '../assets/llaveros/snoopy.jpg';
import patricio from '../assets/llaveros/patricio.jpg';
import dientepresonalizado from '../assets/llaveros/dientepersonalizado.jpeg';

const crearProducto = (id, nombre, precio, medida, stock, descripcion, imagen, material = "Hilo 60% Algodón 40% Acrílico") => ({
  id,
  nombre,
  precio,
  categoria: "Llaveros",
  material,  // ← AHORA VIENE DEL PARÁMETRO
  medida,
  stock,
  descripcion,
  imagen,
});

export const llaveros = [
  crearProducto(1, "Llavero Luffy", 8, "10 cm", 1, "Llavero Amigurumi de Luffy tejido a mano con detalles precisos.", luffy),
  crearProducto(2, "Llavero Pochacco", 8, "10 cm", 1, "Llavero de Pochacco, tierno y resistente.", pochacco),
  crearProducto(3, "Llavero de Zorro", 6, "7 cm", 1, "Llavero de Zorro, tierno y resistente.", zorroMediano),
  crearProducto(4, "Llavero de Pato con Gorro de Rana", 6, "5 cm", 1, "Llavero de Pato, tierno y resistente.", patocongorroderana),
  crearProducto(5, "Mini Llavero de Pug", 1.50, "3 cm", 1, "Llavero de Perro Pug, tierno y resistente.", llaveroperritopug),
  crearProducto(6, "Llavero Capibara", 3, "5 cm", 1, "Llavero de Capibara, tierno y resistente.", capibara),
  crearProducto(7, "Llavero de Pikachu", 8, "10 cm", 1, "Llavero de Pikachu, tierno y resistente.", pikachu),
  crearProducto(8, "Llavero de Pluto", 5, "5 cm", 0, "Llavero de Pluton, tierno y resistente.", pluton),
  crearProducto(9, "Llavero de Pingüino Lila", 3, "4 cm", 0, "Llavero de Pingüino color lila, tierno y resistente.", pinguinolila),
  crearProducto(10, "Mini Llavero de Kirby", 3, "3 cm", 0, "Llavero de Kirby, tierno y resistente.", kirby),
  crearProducto(11, "Llavero de Gato", 4, "5 cm", 0, "Llavero de Gato, tierno y resistente.", gato),
  crearProducto(12, "Llavero Mini Yoshi", 4, "4 cm", 0, "Llavero de Yoshi, tierno y resistente.", yoshi),
  crearProducto(13, "Llavero de Osito con Bufanda Azul", 3, "4 cm", 1, "Llavero de Osito con su Bufanda Azul, tierno y resistente.", osito),
  crearProducto(14, "Llavero de Cinnamoroll", 8, "7 cm", 1, "Llavero de Cinnamoroll, tierno y resistente.", cinnamoroll),
  crearProducto(15, "Llavero de Wolverine", 5, "4 cm", 0, "Llavero de Wolverine, incluye super poderes 😉", wolverine),
  crearProducto(16, "Llavero de Deadpool", 5, "4 cm", 0, "Llavero de Deadpool, incluye sentido del humor 😉", deadpool),
  crearProducto(17, "Mini Llaver Ballenita rosa", 2, "3 cm", 1, "Llavero pequeñito de Ballenita color rosa, tierno y resistente.", ballenita),
  crearProducto(18, "Llavero de Cochinito con Overol", 6, "6 cm", 1, "Llavero de Cochinito vestido, tierno y resistente.", chanchoconoverol),
  crearProducto(19, "Llavero de Conejito", 4, "5 cm", 1, "Llavero de Mini Conejo, tierno y resistente.", miniconejo),
  crearProducto(20, "Llavero de Pingüino Rosa", 3, "4 cm", 0, "Llavero de Pingüino color rosa, tierno y resistente.", pinguinorosa),
  crearProducto(21, "Llavero de Champiñón de Vida Extra", 3, "3 cm", 1, "Llavero de Champiñón de Vida Extra, incluye la vida extra 😉", hongoverde),
  crearProducto(22, "Llavero de Snoopy", 5, "5 cm", 0, "Llavero de Snoopy supertierno y con detalles precisos.", snoopy),
  crearProducto(23, "Llavero de Patricio", 5, "5 cm", 1, "Llavero de Patricio, el mejor amigo que podrías tener.", patricio),
  crearProducto(24, "Llavero de Diente Personalizado", 5, "5 cm", 1, "¡Tu sonrisa te acompaña a todos lados! 🦷✨ Le Colocamos tu Nombre!", dientepresonalizado),
  

];