"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
// import { Button } from "@/π>";
import AppFormikInput from "@/components/self/AppFormikInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  useCreateConsent,
  useCreateCustomer,
  useGenerateToken,
  useGetCustomers,
  useGetProviders,
  useListAccounts,
  useListBalances,
  useListTransactions,
  useUploadJson,
  // useUploadOnAzure,
} from "@/hooks/financeHooks";
import BanksTable from "../BanksTable";
import {
  saudi_defaultBanksList,
  SA,
  UAE,
  defaultCategories,
  defaultSubCategories,
  getAccessTokenFront,
} from "@/constants";
import { toast } from "@/hooks/use-toast";
import {
  AllProcessPayload,
  BankProvider,
  CreateConsentPayload,
  CreateConsentResponse,
  CreateCustomerPayload,
  CreateCustomerResponse,
  Customer,
  GetCustomersResponse,
  isBankStatusOkSaudi,
  ListAccountsResult,
  ListbalancesPayload,
  ListTransactionsPayload,
  //   isBankStatusOk,
} from "@/logic/services/financeService";
import DefaultTable from "../DefaultTable";
import { SelectCategory } from "../SelectCategory";
import { SelectSubCategory } from "../SelectSubCategory";
import io, { Socket } from "socket.io-client";
import { Button } from "../ui/button";
import {
  formatDirectoryName,
  UploadProps,
} from "@/logic/services/azureUploadService";
import UAETable from "../UAETable";
import { APP_ENVS } from "@/config/envs";
import Modal from "./modal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useAppSelector } from "@/logic/redux/hooks";
import { selectOrbiUser } from "@/logic/redux/reducers/auth";
import axios from "axios";
interface FormPayload {
  country: string;
  email: string;
  companyName: string;
}

const countries = [
  { code: UAE, name: "United Arab Emirates", flag: "/uae-flag.webp" },
  { code: SA, name: "Saudi Arabia", flag: "/saudi-flag.webp" },
];

const initialValues: FormPayload = {
  country: "AE",
  email: "",
  companyName: "",
};

const formSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  companyName: Yup.string().required("Company name is required"),
});

const MakeProcessCmp = () => {
  const [currentConsentId, setcurrentConsentId] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    // Connect to the Socket.IO server
    const socketUrl = APP_ENVS.socketUrl;
    const socket = io(socketUrl); // Socket.IO server URL

    // Get the socket ID once the client is connected
    socket.on("connect", () => {
      // setSocketId(socket.id); // Store the socket ID in the state
      console.log("Connected to server with socket ID:", socket.id);
    });

    // Listen for 'broadcast' events from the server
    socket.on("broadcast", (data) => {
      console.log("Received broadcast:", data);

      const eventName = data.event;
      const eventConsentId = data.consentId;
      // const ourConsentId = currentConsentId;

      console.log(`${eventName} - ${eventConsentId} - ${currentConsentId}`);
      // const our
      if (
        eventConsentId == currentConsentId &&
        eventName == "CONSENT_AUTHORIZED"
      ) {
        // alert("on peut continuer le flow");
        // setcanFetchAccounts(true);

        if (!existingUser || !selectedBank) return;

        const jwtAccessToken = getAccessTokenFront();

        const p: AllProcessPayload = {
          customerId: existingUser.id,
          providerId: selectedBank.id,
          consentId: currentConsentId,
          formPayload: {
            country: submitedValues!.country,
            email: submitedValues!.email,
            companyname: submitedValues!.companyName,
            category: selectedCategory!.name,
            subCategory: selectedSubCategory!.name,
            bankname: selectedBank?.englishName,
            clientname: orbiUser?.username || "orbii",
          },
        };

        // const response = axios.post(
        //   "https://connect.orbii.ai/api/finance/test",
        //   {
        //     payload: p,
        //     jwtAccessToken,
        //   }
        // );

        const response = axios.post("/api/finance/test", {
          payload: p,
          jwtAccessToken,
        });

        // const response = axios

        // setisFormSubmitted(false);
        // formik.setValues({ email: "", companyName: "", country: "" });
        // //setselectedCategory(null);
        // //setselectedSubCategory(null);
        // formik.setErrors({ companyName: "", country: "", email: "" });
        // formik.setTouched({ companyName: false, country: false, email: false });

        // setTimeout(() => {
        //   listUserAccounts({
        //     customerId: existingUser.id,
        //     providerId: selectedBank.id,
        //     consentId: currentConsentId,
        //   });
        // }, 10000);
      }
    });

    // Handle errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [currentConsentId]);

  const [selectedBank, setselectedBank] = useState<BankProvider | null>(null);
  const [existingUser, setexistingUser] = useState<Customer | null>();
  const [isFormSubmitted, setisFormSubmitted] = useState(false);

  const {
    mutate: createConsent,
    isLoading: isCreatingConsent,
    data: consentCreatedData,
  } = useCreateConsent((result: CreateConsentResponse) => {
    console.log("consent created successfully");
    console.log(result);
    setcurrentConsentId(result.data.id);

    const link = result.data.authorizationLink;

    // setIframeUrl(link);
    // setModalOpen(true); // Ouvrir la modal avec le lien

    window.open(link, "_blank");
  });

  const { mutate: createCustomer, isLoading: isCreatingCustomer } =
    useCreateCustomer((data: CreateCustomerResponse) => {
      console.log("create custom er data");
      console.log(data);
      setexistingUser(data.data);
    });
  const [submitedValues, setsubmitedValues] = useState<FormPayload>();

  const {
    data: generated_token,
    isLoading: isCreatingToken,
    isError,
    error,
  } = useGenerateToken({
    onSuccess: () => {
      // toast({ title: "refetch providers" });
      refetchProviders();
    },
    onError: () => {},
    enabled: true,
  });

  const {
    data: providers,
    isLoading: loadingProviders,
    isError: isProviderError,
    error: providerError,
    refetch: refetchProviders,
  } = useGetProviders({
    getProps: {
      countryCode: "SA",
    },
    onError: () => {},
    onSuccess: () => {},
    enabled: false,
  });

  const {
    data: customers,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
    error: customersError,
    refetch: refectchCustomers,
  } = useGetCustomers({
    onError: () => {},
    onSuccess: (result: GetCustomersResponse) => {
      // data
      console.log(result);

      const userExist = result.data.find(
        (value) =>
          value.email.toLowerCase() == formik.values.email.toLowerCase()
      );
      console.log("userExist");
      console.log(userExist);
      if (userExist) {
        setexistingUser(userExist);
        return;
      }

      const p: CreateCustomerPayload = {
        type: "Business",
        email: formik.values.email,
        nationalId: "ffffffffff",
      };
      createCustomer(p);
    },
    // enabled: false,
    enabled: isFormSubmitted,
  });

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    onSubmit: (formValues) => {
      setsubmitedValues(formValues);
      setisFormSubmitted(true);
    },
  });

  const handleSelectBankSA = (bank: BankProvider) => {
    console.log("bank ", bank);
    console.log("existingUser ", existingUser);
    setselectedBank(bank);

    if (existingUser) {
      const p: CreateConsentPayload = {
        customerId: existingUser.id,
        providerId: bank.id,
        permissions: [
          "ReadAccountsBasic",
          "ReadAccountsDetail",
          "ReadBalances",
          "ReadParty",
          "ReadPartyPSU",
          "ReadPartyPSUIdentity",
          "ReadBeneficiariesBasic",
          "ReadBeneficiariesDetail",
          "ReadTransactionsBasic",
          "ReadTransactionsDetail",
          "ReadTransactionsCredits",
          "ReadTransactionsDebits",
        ],
      };
      createConsent(p);
      return;
    }
  };

  const [selectedCategory, setselectedCategory] = useState<
    (typeof defaultCategories)[0] | null
  >();
  const [selectedSubCategory, setselectedSubCategory] = useState<
    (typeof defaultSubCategories)[0] | null
  >();

  const orbiUser = useAppSelector(selectOrbiUser);

  return (
    <div
      className=" w-full flex flex-col mx-auto items-center"
      data-testid="login-form"
    >
      {isCreatingToken ||
      isLoadingCustomers ||
      isCreatingCustomer ||
      isCreatingConsent ? (
        <div className="flex justify-center items-center">
          <img
            src="/light.png"
            alt="Loading"
            className="animate-spin w-16 h-16"
          />
        </div>
      ) : (
        <div className="md:min-w-[500px]">
          {!isFormSubmitted && (
            <form onSubmit={formik.handleSubmit} className="w-full ">
              <div className="flex flex-col w-full gap-y-4">
                <div>
                  <Select
                    value={formik.values.country}
                    onValueChange={(val) => {
                      console.log(val);
                      formik.setValues({ ...formik.values, country: val });
                    }}
                  >
                    <SelectTrigger className="w-[200px] inputsBgGradient">
                      <SelectValue
                        className=""
                        placeholder="Select a country"
                      />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectGroup>
                        {countries.map((country) => {
                          return (
                            <SelectItem className="" value={country.code}>
                              <div className="flex text-xs space-x-2">
                                <img
                                  className="w-4 h-4 "
                                  src={country.flag}
                                  alt=""
                                />
                                <p>{`${country.name}`}</p>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.errors["country"] ? (
                    <div
                      className="p-2 bg-red-100 text-red-900 text-xs font-semibold"
                      role="alert"
                    >
                      {formik.errors["country"]}
                    </div>
                  ) : null}
                </div>

                <AppFormikInput
                  placeholder="Ex: john@example.com"
                  name="email"
                  type="email"
                  title=""
                  required
                  data-testid="email-input"
                  formik={formik}
                  label="Email"
                />
                <AppFormikInput
                  placeholder="Ex: Acme Inc."
                  name="companyName"
                  type="text"
                  title=""
                  required
                  data-testid="company-name-input"
                  formik={formik}
                  label="Company Name"
                />
                <SelectCategory
                  selectedCategory={selectedCategory}
                  setselectedCategory={setselectedCategory}
                />

                {selectedCategory && (
                  <SelectSubCategory
                    allSubcategories={defaultSubCategories.filter(
                      (v) => v.category_id == selectedCategory.id
                    )}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory || null}
                    setselectedSubCategory={setselectedSubCategory}
                  />
                )}
              </div>

              <Button
                type="submit"
                data-testid="login-button"
                className="w-full mt-6"
              >
                Submit
              </Button>
            </form>
          )}
          {providers &&
            existingUser &&
            isFormSubmitted &&
            formik.values.country == SA && (
              <div>
                <DefaultTable
                  formPayload={{
                    country: submitedValues!.country,
                    email: submitedValues!.email,
                    companyname: submitedValues!.companyName,
                    category: selectedCategory!.name,
                    subCategory: selectedSubCategory!.name,
                    // bankname: selectedBank?.englishName,
                    clientname: orbiUser?.username || "orbii",
                  }}
                  companyName={submitedValues?.companyName!}
                  handleSelectBankSA={handleSelectBankSA}
                  providers={providers.data}
                />
              </div>
            )}
          {providers && isFormSubmitted && formik.values.country == UAE && (
            <div>
              <UAETable
                formPayload={{
                  country: submitedValues!.country,
                  email: submitedValues!.email,
                  companyname: submitedValues!.companyName,
                  category: selectedCategory!.name,
                  subCategory: selectedSubCategory!.name,
                  // bankname: selectedBank?.englishName ,
                  clientname: orbiUser?.username || "orbii",
                }}
                email={submitedValues?.email!}
                companyName={submitedValues?.companyName!}
                handleSelectBankSA={handleSelectBankSA}
              />
            </div>
          )}
        </div>
      )}

      <AlertDialog open={isModalOpen} onOpenChange={(val) => setModalOpen(val)}>
        <AlertDialogContent className="bg-white rounded-lg w-full max-w-5xl p-4 relative">
          <iframe
            src={iframeUrl}
            className="w-full h-[700px]"
            title="Authorization"
          ></iframe>
          <div style={{ height: "1rem" }}></div> {/* Spacer div */}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MakeProcessCmp;
