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
} from "@/constants";
import { toast } from "@/hooks/use-toast";
import {
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
interface LoginPayload {
  country: string;
  email: string;
  companyName: string;
}

const countries = [
  { code: UAE, name: "United Arab Emirates", flag: "/uae-flag.webp" },
  { code: SA, name: "Saudi Arabia", flag: "/saudi-flag.webp" },
];

const initialValues: LoginPayload = {
  country: "AE",
  //   country: "",
  email: "",
  companyName: "",
};

const loginSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  companyName: Yup.string().required("Company name is required"),
});

let socket: Socket;

const LoginForm = () => {
  const [currentConsentId, setcurrentConsentId] = useState("");
  const [messages, setMessages] = useState([]);

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

        setTimeout(() => {
          listUserAccounts({
            customerId: existingUser.id,
            providerId: selectedBank.id,
            consentId: currentConsentId,
          });
        }, 10000);
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

  // useEffect(() => {
  //   socket = io("http://localhost:8000");
  //   console.log("socket created");

  //   socket.on("hello", (data) => {
  //     console.log("Message from server:", data);
  //   });

  //   socket.emit("messageFromClient", { message: "Hello, server!" });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const [selectedBank, setselectedBank] = useState<BankProvider | null>(null);
  const [existingUser, setexistingUser] = useState<Customer | null>();
  const [isFormSubmitted, setisFormSubmitted] = useState(false);
  //   const [canFetchProviders, setcanFetchProviders] = useState(false);

  const [isUploadingFilesToAzure, setisUploadingFilesToAzure] = useState(false);

  const [allAccountsJson, setallAccountsJson] =
    useState<ListAccountsResult | null>(null);
  // const [alltransactionssJson, setalltransactionssJson] = useState(null)

  const {
    mutate: uploadJsonToAzure,
    isLoading: isUploadingOnAzure,
    data: azureUploadData,
  } = useUploadJson(
    (data: any) => {
      // console.log("upload success");
      console.log(data);
    },
    (error: any) => {
      console.log("error on uploading");
      console.log(error);
    }
  );

  const handleUploadOnAzure = () => {
    const d = {
      data: [
        {
          id: "2aadc657-7972-4dd8-9f16-9ee04dfe01f3",
          currency: {
            id: "02d3bac3-eb2b-4c25-a476-9e7b0e411bf4",
            englishName: "Saudi Arabia Riyal",
            arabicName: "ريال سعودي",
            iso4117Code: "SAR",
            iso4117Number: "682",
          },
          accounts: [
            {
              id: "0480a944-bf0d-4827-84d7-26edb81d56cb",
              scheme: "KSAOB.IBAN",
              identification: "SA6305000068203856266423",
              name: "Abdulaziz Abusaleh",
            },
          ],
          status: "Active",
          statusUpdatedDateTime: "2024-04-24T13:48:48.949+00:00",
          type: "KSAOB.Retail",
          subType: "CurrentAccount",
          description: "Abdulaziz Abusaleh",
          openingDate: "2024-01-25T13:48:48.949+00:00",
          maturityDate: "2024-04-24T13:48:48.949+00:00",
        },
        {
          id: "dfc82a96-9429-49a2-9f6d-c6c4152f87dd",
          currency: {
            id: "02d3bac3-eb2b-4c25-a476-9e7b0e411bf4",
            englishName: "Saudi Arabia Riyal",
            arabicName: "ريال سعودي",
            iso4117Code: "SAR",
            iso4117Number: "682",
          },
          accounts: [
            {
              id: "bc4bb4ce-84fd-4a52-a594-8932a2a52b48",
              scheme: "KSAOB.IBAN",
              identification: "SA1905000000203000001996",
              name: "Abdulaziz Abusaleh",
            },
          ],
          status: "Active",
          statusUpdatedDateTime: "2024-04-24T13:52:57.608+00:00",
          type: "KSAOB.Retail",
          subType: "CurrentAccount",
          description: "Abdulaziz Abusaleh",
          openingDate: "2024-01-25T13:52:57.607+00:00",
          maturityDate: "2024-04-24T13:52:57.607+00:00",
        },
      ],
      meta: {
        currentPageNumber: "1",
        pageSize: "20",
        totalNumberOfPages: "1",
      },
    };

    const accountsJson: UploadProps = {
      directoryName: "companyFormatted",
      fileName: "list-of-accounts.json",
      data: {
        value: d.data[0],
        // value: d.data,
      },
    };
    uploadJsonToAzure(accountsJson);
  };

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

  const [canFetchAccounts, setcanFetchAccounts] = useState(false);

  const {
    mutate: listUserBalances,
    data: list_of_Balances,
    isLoading: isGettingBalances,
    isError: isGetBalancesError,
    error: getBalancesError,
  } = useListBalances(
    (balances: any) => {
      console.log("all Balances ", balances);
      console.log("all accounts ", allAccountsJson);

      const p: ListTransactionsPayload = {
        consentId: currentConsentId,
        accountIds: allAccountsJson!.data.map((val) => val.id),
      };

      setTimeout(() => {
        listUserTransactions(p);
      }, 20000);
    },
    () => {}
  );

  const {
    mutate: listUserTransactions,
    data: list_of_Transactions,
    isLoading: isGettingTransactions,
    isError: isGetTransactionsError,
    error: getTransactionsError,
  } = useListTransactions(
    (result: any) => {
      console.log("all transactions ", result);

      const data = {
        hello: "world",
        name: "richard",
        test: true,
      };
      const filePath = `uploads/${new Date().toISOString()}_${"test"}`;
      const companyFormatted = formatDirectoryName(
        formik.values.companyName,
        selectedBank?.englishName!
      );

      console.log("companyFormatted ", companyFormatted);

      //     [X] - Un fichier qui contient PAYS , EMAIL , COMPANY , Category,SubCat, data.json
      // [X] - Un fichier qui contient liste des comptes list-of-accounts.json
      // [X] - Un fichier qui contient les transactions transactions.json

      setisUploadingFilesToAzure(true);
      const dataJson: UploadProps = {
        directoryName: companyFormatted,
        fileName: "data.json",
        data: {
          country: formik.values.country,
          email: formik.values.email,
          companyname: formik.values.companyName,
          category: selectedCategory,
          subCategory: selectedSubCategory,
          bankname: selectedBank?.englishName,
          clientname: "orbii",
        },
      };
      uploadJsonToAzure(dataJson);

      console.log("before ", list_of_accounts);

      console.log("liste des comptes ");
      console.log(allAccountsJson);

      console.log("liste des transactions ");
      console.log(result);

      const accountsJson: UploadProps = {
        directoryName: companyFormatted,
        fileName: "list-of-accounts.json",
        data: {
          ...allAccountsJson?.data,
        },
      };
      uploadJsonToAzure(accountsJson);

      const transactionsJson: UploadProps = {
        directoryName: companyFormatted,
        fileName: "transactions.json",
        data: {
          list_of_Transactions: result,
        },
      };
      uploadJsonToAzure(transactionsJson);

      const balancesJson: UploadProps = {
        directoryName: companyFormatted,
        fileName: "balances.json",
        data: {
          list_of_Balances: list_of_Balances,
        },
      };
      uploadJsonToAzure(balancesJson);
    },
    () => {}
  );

  const {
    mutate: listUserAccounts,
    data: list_of_accounts,
    isLoading: isGettingAccounts,
    isError: isGetAccountsError,
    error: getAccountsError,
  } = useListAccounts(
    (result: ListAccountsResult) => {
      console.log("useListAccounts ", list_of_accounts?.data.length);
      console.log(result);

      setallAccountsJson(result);

      if (result.data.length == 0) {
        toast({ title: "No account found", variant: "destructive" });
        return;
      }

      // customerId: "e98f2c04-4de4-4e3c-af24-7e73eb9d8c35",
      // providerId: "0aaed690-3db5-4e3b-9a87-1f4955173715",
      // consentId: "baade0d3-2acd-49b0-b94c-d4e44c231769",

      // const p: ListTransactionsPayload = {
      //   consentId: "baade0d3-2acd-49b0-b94c-d4e44c231769",
      //   accountIds: [
      //     "66a112e9-ed2e-4b85-86b4-2f36797bd060",
      //     "cc0553eb-a718-4445-bfbf-1dcb095639fb",
      //   ],
      // };

      const p: ListbalancesPayload = {
        accountIds: result.data.map((val) => val.id),
      };

      // handleListBalances(p,result)

      setTimeout(() => {
        listUserBalances(p);
      }, 1000);
    },
    () => {}
  );

  // const handleListBalances = (p : ListbalancesPayload,accounts: ListAccountsResult) => {
  //   listUserBalances(p)
  // }

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

  //   getProviderMutation.

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (formValues) => {
      setisFormSubmitted(true);
      //   console.log("formValues ", formValues);
    },
  });

  // const handleSelectBank = (bank: BankProvider) => {
  //   console.log("bank");
  //   console.log(bank);
  //   console.log(existingUser);
  //   if (formik.values.country == SA) {
  //     if (existingUser) {
  //       const p: CreateConsentPayload = {
  //         customerId: existingUser.id,
  //         providerId: bank.id,
  //         permissions: [],
  //       };
  //       createConsent(p);
  //       return;
  //     }

  //     //   const isBankSupported = isBankStatusOk(bank);
  //     //   console.log("isBankSupported ", isBankSupported);
  //     return;
  //   }

  //   // const p: CreateCustomerPayload = {
  //   //   type: "Business",
  //   //   email: "richard.bathiebo.9@gmail.com",
  //   //   nationalId: "ffffffffff",
  //   // };
  //   // createCustomer(p);
  // };

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

  return (
    <div
      className=" w-full flex flex-col mx-auto items-center"
      data-testid="login-form"
    >
      {/* <h1 className="text-large-semi uppercase mb-6">Login </h1> */}
      {isCreatingToken ||
      isLoadingCustomers ||
      isCreatingCustomer ||
      isCreatingConsent ? (
        <p>Loading...</p>
      ) : (
        <div className="md:min-w-[500px]">
          {/* {providers ? "e" : "def"} */}
          {!isFormSubmitted && (
            <form onSubmit={formik.handleSubmit} className="w-full ">
              <div className="flex flex-col w-full gap-y-4">
                {/* <Button
                  onClick={() => {
                    handleUploadOnAzure();
                  }}
                >
                  Click to upload on Azure
                </Button> */}
                {/* <Button
                  onClick={() => {
                    listUserAccounts({
                      // customerId: "3ceb7ec7-6717-40b5-ba26-01bc258c3e73",
                      customerId: "e98f2c04-4de4-4e3c-af24-7e73eb9d8c35",
                      providerId: "0aaed690-3db5-4e3b-9a87-1f4955173715",
                      consentId: "baade0d3-2acd-49b0-b94c-d4e44c231769",
                      // consentId: "98cafd06-51b5-4a24-b5d4-d4169ed1875c",
                    });
                  }}
                >
                  CLICK to list accounts
                </Button> */}
                <div>
                  <Select
                    value={formik.values.country}
                    onValueChange={(val) => {
                      console.log(val);
                      formik.setValues({ ...formik.values, country: val });
                    }}
                  >
                    <SelectTrigger className="w-[180px] inputsBgGradient">
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
                //   ischarging={mutation.isLoading}
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
                {/* <h1>Open Banking - Bank Coverage {currentConsentId} </h1> */}
                {/* <BanksTable
                handleSelectBank={handleSelectBank}
                providers={defaultBanksList}
              /> */}

                <DefaultTable
                  companyName={formik.values.companyName}
                  // directoryName={formatDirectoryName(
                  //   formik.values.companyName,
                  //   selectedBank?.englishName!
                  // )}
                  handleSelectBankSA={handleSelectBankSA}
                  providers={providers.data}
                />
                {/* <BanksTable
                country={formik.values.country}
                handleSelectBank={handleSelectBank}
                providers={providers.data}
              /> */}
              </div>
            )}
          {providers && isFormSubmitted && formik.values.country == UAE && (
            <div>
              {/* <h1>Open Banking - Bank Coverage {currentConsentId} </h1> */}
              {/* <BanksTable
                handleSelectBank={handleSelectBank}
                providers={defaultBanksList}
              /> */}

              <UAETable
                email={formik.values.email}
                companyName={formik.values.companyName}
                // directoryName={formatDirectoryName(
                //   formik.values.companyName,
                //   selectedBank?.englishName!
                // )}
                handleSelectBankSA={handleSelectBankSA}
              />
              {/* <BanksTable
                country={formik.values.country}
                handleSelectBank={handleSelectBank}
                providers={providers.data}
              /> */}
            </div>
          )}
        </div>
      )}
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        iframeUrl={iframeUrl}
      /> */}

      {/* <Button
        onClick={() => {
          setIframeUrl(
            "https://link.eumlet.com/entity?redirect_url=google.com&nonce=7d294f2a195303e3fc77e0407a84a166&customer_id=e4609a5d-daa2-4ac7-8cef-a3c8f39a347a&end_user_id=a14b3295-7a92-4d63-841e-e24ba0b7c408&corporate=true"
          );
          setModalOpen(true); // Ouvrir la modal avec le lien
        }}
      >
        click to open
      </Button> */}

      <AlertDialog open={isModalOpen} onOpenChange={(val) => setModalOpen(val)}>
        {/* <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> */}
        <AlertDialogContent className="w-full max-w-4xl border-0 ">
          <iframe
            src={iframeUrl}
            className="w-full h-[500px] border-0"
            title="Authorization"
          ></iframe>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            {/* <AlertDialogAction onClick={() => onOk()}>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LoginForm;
