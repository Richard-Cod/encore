import { getCookie } from "cookies-next";
import { APP_ENVS } from "./config/envs";

const pstore = "/project/p/store";

const ROUTES = {
  support: pstore + "/support",
  privacyPolicy: pstore + "/privacy-policy",
  about: pstore + "/about",
  termsAndConditions: pstore + "/terms-and-conditions",

  home: "/",
  login: "/account/login",
  register: "/account/register",
  forgotPassword: "/account/forgot-password",
  emailActivationSent: "/account/sent-activation-email",
  resend_emailActivation: "/account/resend-activation-email",
};

const AppConstants = {
  logo: "/dealitlogo.png",
  project_name: "FinanceApp",
  contact_email: "ouaga.marketplace@gmail.com",
  access_token_key: "access_token_key",
  refresh_token_key: "refresh_token_key",
  cart_id_key: "cart_id_key",
};

export const getAccessTokenFront = () =>
  getCookie(AppConstants.access_token_key);
export const getAuthHeader = () => ({
  Authorization: "Bearer " + getAccessTokenFront(),
});
export const getRefreshToken = () => getCookie(AppConstants.refresh_token_key);

export const API_BASE_URL = `${APP_ENVS.API_BASE_URL}/api`;

export { ROUTES, AppConstants };

export const UAE = "AE";
export const SA = "SA";

export const defaultBanksList = [
  {
    bank: "Gulf International Bank (GIB)",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Alinma Bank",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Arab National Bank (ANB)",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Saudi National Bank (SNB)",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Bank Albilad",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Al Rajhi Bank",
    status: "not-yet",
    expectedGoLive: "Expected Q4 '24",
  },
  {
    bank: "Bank Al Jazira",
    status: "not-yet",
    expectedGoLive: "Expected Q4 '24",
  },
  {
    bank: "Riyad Bank",
    status: "not-yet",
    expectedGoLive: "Expected Q4 '24",
  },
  {
    bank: "Banque Saudi Fransi",
    status: "not-yet",
    expectedGoLive: "Expected Q4 '24",
  },
  {
    bank: "The Saudi Investment Bank",
    status: "not-yet",
    expectedGoLive: "Expected Q4 '24",
  },
  {
    bank: "SAB",
    status: "not-yet",
    expectedGoLive: "Expected Q4 '24",
  },
];
