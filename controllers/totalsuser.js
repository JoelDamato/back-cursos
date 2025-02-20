const User = require('../models/Users');

const getTotals = async (req, res) => {
    try {
        // Contar el total de usuarios
        const totalUsers = await User.countDocuments();

        // Contar la cantidad de usuarios en cada curso
        const courseCounts = await User.aggregate([
            { $unwind: "$cursos" }, // Desglosa la lista de cursos por usuario
            { $group: { _id: "$cursos", count: { $sum: 1 } } }, // Cuenta por curso
            { $sort: { count: -1 } } // Ordena de mayor a menor
        ]);

        // Contar la cantidad de usuarios por rol (admin vs user)
        const roleCounts = await User.aggregate([
            { $group: { _id: "$rol", count: { $sum: 1 } } }
        ]);

        // Contar usuarios creados por día
        const usersPerDay = await User.aggregate([
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } // Agrupar por fecha
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Ordenar por fecha
        ]);

        // Respuesta con todas las métricas
        res.status(200).json({
            totalUsers,
            courses: courseCounts.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}), // { "Focus": 10, "Master Fade": 5, ... }
            roles: roleCounts.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}), // { "user": 50, "admin": 5 }
            usersPerDay: usersPerDay.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}) // { "2024-02-19": 5, "2024-02-20": 3 }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las métricas', error });
    }
};

module.exports = getTotals;
