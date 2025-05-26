const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./models/Users");
const Onboarding = require("./models/Onboarding");

const MONGODB_URI = "mongodb://damatojoel25:jWOsVKueUGU1MwlM@cluster0-shard-00-00.mkhzd.mongodb.net:27017,cluster0-shard-00-01.mkhzd.mongodb.net:27017,cluster0-shard-00-02.mkhzd.mongodb.net:27017/test?ssl=true&replicaSet=atlas-13201f-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB");

    // 1. Obtener usuarios con el curso "Master Fade 3.0"
    const usuarios = await User.find({
      cursos: { $in: ["Master Fade 3.0"] }
    });

    console.log(`👥 Usuarios con "Master Fade 3.0": ${usuarios.length}`);

    if (usuarios.length === 0) {
      console.warn("⚠️ No se encontraron usuarios con ese curso.");
      return mongoose.disconnect();
    }

    // 2. Buscar formulario para cada usuario
    const resultados = await Promise.all(
      usuarios.map(async (usuario) => {
        const form = await Onboarding.findOne({ email: usuario.email });

        return {
          nombre: usuario.nombre || "",
          email: usuario.email || "",
          telefono: usuario.telefono || "",
          completoForm: usuario.completoForm ? "Sí" : "No",
          fechaAsignacion: usuario.fechaAsignacionMasterFade30
            ? new Date(usuario.fechaAsignacionMasterFade30).toLocaleDateString("es-AR")
            : "No registrada",
          fechaFormCompletado: usuario.fechaFormCompletado
            ? new Date(usuario.fechaFormCompletado).toLocaleDateString("es-AR")
            : "No registrada",
          pais: form?.pais || "",
          whatsapp: form?.whatsapp || "",
          instagram: form?.instagram || "",
          trabajaComoBarbero: form?.trabajaComoBarbero || "",
          tipoTrabajo: form?.tipoTrabajo || "",
          tiempoCorte: form?.tiempoCorte || "",
          precioPromedio: form?.precioPromedio || "",
          motivacion: form?.motivacion || "",
          objetivo3Meses: form?.objetivo3Meses || "",
          aprenderClientes: form?.aprenderClientes || "",
          abrirBarberia: form?.abrirBarberia || "",
          serEducador: form?.serEducador || "",
          esfuerzoExtra: form?.esfuerzoExtra || "",
        };
      })
    );

    // 3. Crear CSV
    const encabezado = [
       "Email", "Teléfono","País", "WhatsApp"
    ].join(",") + "\n";

    const filas = resultados.map((r) =>
      [
         r.email, r.telefono, r.pais, r.whatsapp
      ].map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const csv = encabezado + filas;

    // 4. Guardar archivo
    const filePath = path.join(__dirname, "usuarios_masterfade3_formularios.csv");
    fs.writeFileSync(filePath, csv, "utf8");

    console.log(`✅ CSV generado con ${resultados.length} registros.`);
    console.log(`📄 Guardado en: ${filePath}`);

    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error);
  });
