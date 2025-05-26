const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./models/Users");

const MONGODB_URI = "mongodb://damatojoel25:jWOsVKueUGU1MwlM@cluster0-shard-00-00.mkhzd.mongodb.net:27017,cluster0-shard-00-01.mkhzd.mongodb.net:27017,cluster0-shard-00-02.mkhzd.mongodb.net:27017/test?ssl=true&replicaSet=atlas-13201f-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB");

    const usuarios = await User.find({
      cursos: { $in: ["Master Fade 3.0"] } // 👈 forma correcta
    });

    console.log(`👥 Usuarios con "Master Fade 3.0": ${usuarios.length}`);

    if (usuarios.length === 0) {
      console.warn("⚠️ No se encontraron usuarios con ese curso. Revisa que esté correctamente asignado.");
      return mongoose.disconnect();
    }

    const resultados = usuarios.map((usuario) => ({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      telefono: usuario.telefono || "",
      fechaAsignacion: usuario.fechaAsignacionMasterFade30
        ? new Date(usuario.fechaAsignacionMasterFade30).toLocaleDateString("es-AR")
        : "No registrada",
      fechaFormCompletado: usuario.fechaFormCompletado
        ? new Date(usuario.fechaFormCompletado).toLocaleDateString("es-AR")
        : "No registrada",
      completoForm: usuario.completoForm ? "Sí" : "No",
    }));

    const encabezado = "Nombre,Email,Teléfono,Fecha Asignación,Fecha Formulario,Formulario Completado\n";
    const filas = resultados
      .map(
        (u) =>
          `"${u.nombre}","${u.email}","${u.telefono}","${u.fechaAsignacion}","${u.fechaFormCompletado}","${u.completoForm}"`
      )
      .join("\n");

    const csv = encabezado + filas;
    const filePath = path.join(__dirname, "usuarios_masterfade3.csv");
    fs.writeFileSync(filePath, csv, "utf8");

    console.log(`✅ CSV generado con ${resultados.length} usuarios.`);
    console.log(`📄 Guardado en: ${filePath}`);

    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error);
  });
