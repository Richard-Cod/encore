// // pages/api/db.js
// import sql from "mssql";

// const sqlConfig = {
//   user: process.env.DB_USER, // Nom d'utilisateur pour la base de données
//   password: process.env.DB_PASSWORD, // Mot de passe de la base de données
//   database: process.env.DB_NAME, // Nom de la base de données
//   server: process.env.DB_SERVER, // Adresse du serveur SQL Server
//   options: {
//     encrypt: true, // Utilisez true si vous êtes sur Azure
//     trustServerCertificate: true, // Activez si vous êtes en local
//   },
// };

// export async function connectToDatabase() {
//   try {
//     if (!global.connectionPool) {
//       global.connectionPool = await sql.connect(sqlConfig);
//     }
//     return global.connectionPool;
//   } catch (err) {
//     console.error("Erreur de connexion à la base de données:", err);
//     throw err;
//   }
// }
