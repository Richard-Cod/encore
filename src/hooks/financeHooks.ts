// financeServiceHooks.ts
import { useQuery, useMutation } from "react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import financeService, {
  CreateConsentPayload,
  CreateCustomerPayload,
} from "@/logic/services/financeService";
import { toast } from "./use-toast";
import { getCookie, setCookie } from "cookies-next";
import { AppConstants } from "@/constants";

// Types pour les props des hooks (peuvent être adaptés selon les besoins)
interface QueryProps<T> {
  getProps?: T;
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
  enabled: boolean;
}

// interface MutationProps<T> {
//     onSuccess?: (data: any) => void;
//     onError?: (error: AxiosError) => void;
//   }
// CreateCustomerPayload
// Hook pour la génération de token
export function useGenerateToken({ onSuccess, onError }: QueryProps<void>) {
  return useQuery({
    queryKey: ["generate-token"],
    queryFn: () => {
      const token = getCookie(AppConstants.access_token_key);
      setCookie(AppConstants.access_token_key, token);
      if (token) {
        return { access_token: token };
      }

      return financeService.generateToken();
    },
    onSuccess: (data) => {
      toast({ title: "Token generated successfully" });
      onSuccess && onSuccess(data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
      console.log("error");
      console.log(error);
      onError && onError(error);
    },
    refetchOnWindowFocus: false,
  });
}

// Hook pour récupérer les fournisseurs
export function useGetProviders({
  getProps,
  onSuccess,
  onError,
  enabled,
}: QueryProps<{ countryCode?: string }>) {
  return useQuery({
    queryKey: ["providers", getProps?.countryCode],
    queryFn: async () =>
      financeService.getProviders(getProps?.countryCode || "SA"),
    onSuccess: (data) => {
      toast({ title: "Providers fetched successfully" });
      onSuccess && onSuccess(data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
      onError && onError(error);
    },
    refetchOnWindowFocus: false,
    enabled,
    retry: false,
  });
}

// Hook pour créer un client
export function useCreateCustomer(onSuccess?: any, onError?: any) {
  return useMutation({
    mutationFn: async (p: CreateCustomerPayload) =>
      financeService.createCustomer(p),
    onSuccess: (data) => {
      toast({ title: "Customer created successfully" });
      onSuccess && onSuccess(data);
    },
    onError: (error: AxiosError) => {
      const accountExistsError = (error.response?.data as any) || "";

      console.log("error.response?.data ");
      console.log(error.response?.data);
      console.log(error.response?.status);

      if (
        error.response?.status == 409 &&
        accountExistsError == "CUSTOMER_ALREADY_EXISTS"
      ) {
        toast({ title: "Customer already exists" });

        return;
      }
      //   handleApiError(error);
      //   onError && onError(error);
    },
  });
}

// Hook pour obtenir la liste des clients
export function useGetCustomers({
  getProps,
  onSuccess,
  onError,
  enabled,
}: QueryProps<{ jwtAccessToken: string; page?: number; perPage?: number }>) {
  return useQuery({
    queryKey: ["customers", getProps?.page, getProps?.perPage],
    queryFn: async () =>
      financeService.getCustomers(getProps?.page || 1, getProps?.perPage || 20),
    onSuccess: (data) => {
      toast({ title: "Customers fetched successfully" });
      onSuccess && onSuccess(data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
      onError && onError(error);
    },
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
}

// Hook pour créer un consentement
export function useCreateConsent(onSuccess?: any, onError?: any) {
  return useMutation({
    mutationFn: async (p: CreateConsentPayload) =>
      financeService.createConsent(p),
    onSuccess: (data) => {
      toast({ title: "Consent created successfully" });
      onSuccess && onSuccess(data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
      onError && onError(error);
    },
  });
}

// Hook pour lister les comptes
export function useListAccounts({
  getProps,
  onSuccess,
  onError,
}: QueryProps<{
  jwtAccessToken: string;
  customerId: string;
  providerId: string;
}>) {
  return useQuery({
    queryKey: ["accounts", getProps?.customerId, getProps?.providerId],
    queryFn: async () =>
      financeService.listAccounts(
        getProps!.jwtAccessToken,
        getProps!.customerId,
        getProps!.providerId
      ),
    onSuccess: (data) => {
      toast({ title: "Accounts fetched successfully" });
      onSuccess && onSuccess(data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
      onError && onError(error);
    },
    refetchOnWindowFocus: false,
  });
}

// Fonction utilitaire pour gérer les erreurs
async function handleApiError(error: AxiosError) {
  const status = error.response?.status;
  if (status === 401) {
    try {
      const new_token = await financeService.generateToken();
      setCookie(AppConstants.access_token_key, new_token.access_token);
      //   window.location.reload();
      console.log("new token set ", new_token.access_token);
    } catch (error) {}
    // toast({
    //   variant: "destructive",
    //   title: "Unauthorized Access",
    //   description: "Please check your credentials.",
    // });
  } else {
    toast({
      variant: "destructive",
      title: "Request Error",
      description: "An error occurred while processing your request.",
    });
  }
}
