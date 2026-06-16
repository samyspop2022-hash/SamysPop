const { setGlobalOptions } = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

// Función para verificar contraseña de admin
exports.verificarAdmin = onCall(async (request) => {
  const { contrasena } = request.data;
  
  const CONTRASENA_CORRECTA = "%Wow.Electro.2026.";
  
  // Verificar que la contraseña sea correcta
  if (contrasena !== CONTRASENA_CORRECTA) {
    // Guardar intento fallido en Firestore
    await admin.firestore().collection("admin_logs").add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      estado: "fallido",
      razon: "contraseña incorrecta"
    });
    
    throw new Error('Contraseña incorrecta');
  }
  
  // Guardar acceso exitoso en Firestore
  await admin.firestore().collection("admin_logs").add({
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    estado: "exitoso"
  });
  
  return { success: true };
});