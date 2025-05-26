const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const User = require("./models/Users");

const MONGODB_URI="mongodb://damatojoel25:jWOsVKueUGU1MwlM@cluster0-shard-00-00.mkhzd.mongodb.net:27017,cluster0-shard-00-01.mkhzd.mongodb.net:27017,cluster0-shard-00-02.mkhzd.mongodb.net:27017/test?ssl=true&replicaSet=atlas-13201f-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("✅ Conectado a MongoDB");

    const usuariosConForm = await User.find({
      cursos: "Master Fade 3.0",
      completoForm: true,
    });

    const resultados = usuariosConForm.map((usuario) => {
      const progresoMasterFade = usuario.progresoCursos.find(
        (curso) => curso.curso === "Master Fade 3.0"
      );

      let ultimoCapitulo = "No registrado";
      let estadoCapitulo = "Sin estado";

      if (progresoMasterFade && progresoMasterFade.capitulos.length > 0) {
        // Ordenar por número de capítulo descendente
        const capitulosOrdenados = progresoMasterFade.capitulos
          .filter((c) => c.capituloId)
          .sort((a, b) => {
            const numA = parseInt(a.capituloId.split("-").pop(), 10);
            const numB = parseInt(b.capituloId.split("-").pop(), 10);
            return numB - numA;
          });

        if (capitulosOrdenados.length > 0) {
          ultimoCapitulo = capitulosOrdenados[0].capituloId;
          estadoCapitulo = capitulosOrdenados[0].estado || "Sin estado";
        }
      }

      return {
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || "",
        fechaAsignacion: usuario.fechaAsignacionMasterFade30
          ? new Date(usuario.fechaAsignacionMasterFade30).toLocaleDateString("es-AR")
          : "No registrada",
        fechaFormCompletado: usuario.fechaFormCompletado
          ? new Date(usuario.fechaFormCompletado).toLocaleDateString("es-AR")
          : "No registrada",
        ultimoCapitulo,
        estadoCapitulo,
      };
    });

    // CSV
    const encabezado =
      "Nombre,Email,Teléfono,Fecha Asignación,Fecha Formulario,Último Capítulo,Estado Capítulo\n";
    const filas = resultados
      .map(
        (u) =>
          `"${u.nombre}","${u.email}","${u.telefono}","${u.fechaAsignacion}","${u.fechaFormCompletado}","${u.ultimoCapitulo}","${u.estadoCapitulo}"`
      )
      .join("\n");

    const csv = encabezado + filas;

    const filePath = path.join(__dirname, "usuarios_masterfade_estado.csv");
    fs.writeFileSync(filePath, csv, "utf8");

    console.log(`✅ CSV generado con ${resultados.length} usuarios`);
    console.log(`📄 Guardado en: ${filePath}`);

    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Error:", error);
  });