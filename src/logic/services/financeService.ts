// services/financeService.ts

import apiClient from "@/app/axiosConst";
import {
  AppConstants,
  defaultBanksList,
  getAccessTokenFront,
} from "@/constants";
import axios from "axios";
import { getCookie } from "cookies-next";

// Interfaces pour les réponses et payloads
interface TokenResponse {
  access_token: string;
}

// Définition de l'interface pour un fournisseur (Provider)
export interface BankProvider {
  id: string;
  country: Country;
  allowedPermissions: Permission[];
  address: string;
  phone: string;
  arabicName: string;
  englishName: string;
  status: ProviderStatus;
  isEnabled: boolean;
  logo: string;
}

// Définition de l'interface pour un pays (Country)
export interface Country {
  id: string;
  createdAt: string; // ou Date si vous voulez convertir en Date lors de la récupération
  updatedAt: string; // ou Date
  englishName: string;
  arabicName: string;
  iso3166Code: string;
}

// Enum pour les permissions possibles
export enum Permission {
  ReadAccountsBasic = "ReadAccountsBasic",
  ReadAccountsDetail = "ReadAccountsDetail",
  ReadBalances = "ReadBalances",
  ReadParty = "ReadParty",
  ReadPartyPSU = "ReadPartyPSU",
  ReadPartyPSUIdentity = "ReadPartyPSUIdentity",
  ReadBeneficiariesBasic = "ReadBeneficiariesBasic",
  ReadBeneficiariesDetail = "ReadBeneficiariesDetail",
  ReadTransactionsBasic = "ReadTransactionsBasic",
  ReadTransactionsDetail = "ReadTransactionsDetail",
  ReadTransactionsCredits = "ReadTransactionsCredits",
  ReadTransactionsDebits = "ReadTransactionsDebits",
}

// Enum pour les statuts des fournisseurs
export enum ProviderStatus {
  Active = "Active",
  Inactive = "Inactive", // S'il y a d'autres statuts possibles, ajoutez-les ici
}

export interface GetProvidersResponse {
  data: BankProvider[];
}

export interface CreateCustomerPayload {
  type: string;
  email: string;
  nationalId: string;
}

interface Customer {
  id: string;
  type: string;
  email: string;
}

interface CreateCustomerResponse {
  data: Customer;
}

interface GetCustomersResponse {
  data: Customer[];
  page: number;
  perPage: number;
  total: number;
}

interface CreateConsentPayload {
  customerId: string;
  providerId: string;
  permissions: string[];
}

interface Consent {
  id: string;
  customerId: string;
  providerId: string;
  permissions: string[];
}

interface CreateConsentResponse {
  data: Consent;
}

// Fonction pour vérifier si un BankProvider a un statut "ok" dans la liste par défaut
export function isBankStatusOk(provider: BankProvider): boolean {
  const bankInDefaultList = defaultBanksList.find(
    (defaultBank) => defaultBank.bank === provider.englishName
  );
  return bankInDefaultList?.status === "ok";
}

// Service principal pour les requêtes
const financeService = {
  // 1. Generate Token
  async generateToken(): Promise<TokenResponse> {
    // setCookie(AppConstants.access_token_key, access);

    const response = await axios.post<TokenResponse>("/api/finance/getToken");
    return response.data;
  },

  async getProviders(
    countryCode: string = "SA"
  ): Promise<GetProvidersResponse> {
    const jwtAccessToken = getAccessTokenFront();
    const response = await axios.post<GetProvidersResponse>(
      `/api/finance/getProviders?countryCode=${countryCode}`,
      {
        countryCode,
        jwtAccessToken,
      }
      // {
      //   headers: {
      //     Authorization: `${jwtAccessToken}`,
      //   },
      // }
    );
    return response.data;
  },

  // 2. Get Providers
  // async getProviders(
  //   jwtAccessToken: string,
  //   countryCode: string = "SA"
  // ): Promise<GetProvidersResponse> {

  //   const response = await apiClient.get<GetProvidersResponse>(
  //     `/ais/Provider/List?countryCode=${countryCode}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${jwtAccessToken}`,
  //       },
  //     }
  //   );
  //   return response.data;
  // },

  // 3. Create Customer
  async createCustomer(
    payload: CreateCustomerPayload
  ): Promise<CreateCustomerResponse> {
    const jwtAccessToken = getAccessTokenFront();

    const response = await axios.post<CreateCustomerResponse>(
      // "/ais/Customer/Create",
      "/api/finance/create-customer",
      {
        payload,
        jwtAccessToken,
      }
      // {
      //   headers: {
      //     Authorization: `Bearer ${jwtAccessToken}`,
      //     "Content-Type": "application/json",
      //   },
      // }
    );
    return response.data;
  },

  // 4. Get Customers
  async getCustomers(
    jwtAccessToken: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<GetCustomersResponse> {
    const response = await apiClient.get<GetCustomersResponse>(
      `/ais/Customer/List?page=${page}&perPage=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${jwtAccessToken}`,
        },
      }
    );
    return response.data;
  },

  // 6. Create Consent
  async createConsent(
    jwtAccessToken: string,
    payload: CreateConsentPayload
  ): Promise<CreateConsentResponse> {
    const response = await apiClient.post<CreateConsentResponse>(
      "/ais/Consent/Create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwtAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // 7. List Accounts
  async listAccounts(
    jwtAccessToken: string,
    customerId: string,
    providerId: string
  ): Promise<any> {
    const response = await apiClient.get(
      `/ais/Account/List?customerId=${customerId}&providerId=${providerId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtAccessToken}`,
        },
      }
    );
    return response.data;
  },
};

export default financeService;
