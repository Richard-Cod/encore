// "use client"
// utils/axiosInstance.js
import {
  API_BASE_URL,
  AppConstants,
  getAccessTokenFront,
  ROUTES,
} from "@/constants";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const apiClient = axios.create({
  baseURL: "https://sandbox.sparefinancial.sa/api/v1.0",
  headers: {
    accept: "application/json",
    "app-id": "i0T8BLfDW2lljtTUudVZO0NLp3fZ0O0DI347tsBGNcw=",
    "x-api-key": "Jh09I82VCp60dfiddnyboi8VA85BPniuoAc35DT02Y4=",
  },
});

// const apiClient = axios.create({
//   baseURL: `${API_BASE_URL}`,
//   timeout: 60000, // 60 secondes
//   // timeout: 10000, // Configurer le timeout si nécessaire
// });

// Intercepteur pour les réponses d'erreur
// apiClient.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;
//     // console.log("error.response.status")
//     // console.log(error.response.status)
//     // console.log("-------------------")
//     console.log("error.response.data.code ",error.response.data)

//     if (error.response.status === 401 && error.response.data.code === 'token_not_valid') {
//       // Le token est invalide, tenter de rafraîchir le token
//       try {
//         const refreshToken =getCookie(AppConstants.refresh_token_key);
//         console.log("refreshToken ",refreshToken)
//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }
//         const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, { refresh: refreshToken  });

//         const { access } = response.data;
//         setCookie(AppConstants.access_token_key, access, { httpOnly: true });

//         // Mettre à jour l'en-tête Authorization pour la requête originale
//         apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;

//         // Réessayer la requête originale
//         originalRequest.headers['Authorization'] = `Bearer ${access}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.log("on supprime tout")
//         // Gérer l'échec du rafraîchissement du token (ex: déconnexion de l'utilisateur)
//         deleteCookie(AppConstants.access_token_key);
//         deleteCookie(AppConstants.refresh_token_key);
//         // window.location.href = ROUTES.login; // Rediriger vers la page de connexion
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// const token = getAccessTokenFront()
// console.log("token ",token)
// if(token){
// apiClient.defaults.headers.common['Authorization'] = `Bearer `+token;
// }

export default apiClient;
