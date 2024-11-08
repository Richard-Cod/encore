// // pages/api/finance/getProviders.ts

// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
// import { GetProvidersResponse } from "@/logic/services/financeService";
// import { NextResponse } from "next/server";
// import { getCookie } from "cookies-next";
// import { AppConstants } from "@/constants";
// import { headers } from "next/headers";
// import { connectToDatabase } from "@/db";

// // const backendApiUrl = process.env.BACKEND_API_URL; // Assurez-vous de définir cette URL dans .env.local

export async function POST(req: Request, res: Response) {}
// export async function POST(req: Request, res: Response) {
//   try {
//     const db = await connectToDatabase();

//     // Requête SQL pour récupérer les catégories et sous-catégories
//     const result = await db.query(`
//       SELECT
//         c.id AS categoryId,
//         c.name AS categoryName,
//         s.id AS subcategoryId,
//         s.name AS subcategoryName
//       FROM
//         Categories c
//       LEFT JOIN
//         Subcategories s ON c.id = s.categoryId
//       ORDER BY
//         c.id, s.id
//     `);

//     // Organiser les données en format JSON
//     const categories = {} as any;
//     console.log("result");
//     console.log(result);
//     result.recordset.forEach((row: any) => {
//       const { categoryId, categoryName, subcategoryId, subcategoryName } = row;

//       // Si la catégorie n'existe pas encore dans l'objet, l'ajouter
//       if (!categories[categoryId]) {
//         categories[categoryId] = {
//           id: categoryId,
//           name: categoryName,
//           subcategories: [],
//         };
//       }

//       // Ajouter la sous-catégorie si elle existe
//       if (subcategoryId) {
//         categories[categoryId].subcategories.push({
//           id: subcategoryId,
//           name: subcategoryName,
//         });
//       }
//     });

//     // Convertir en tableau de catégories
//     const categoriesArray = Object.values(categories) as any;

//     // Retourner les données au format JSON

//     return new Response(categoriesArray, {
//       status: 200,
//     });

//     // res.status(200).json(categoriesArray);
//   } catch (error) {
//     console.error(
//       "Erreur lors de la récupération des catégories et sous-catégories:",
//       error
//     );
//     // res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
//     return new Response("Erreur lors de la récupération des données.", {
//       status: 500,
//     });
//   }
// }
