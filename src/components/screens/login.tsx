"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { Button } from "@/components/ui/button";
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
  Customer,
  GetCustomersResponse,
  isBankStatusOkSaudi,
  //   isBankStatusOk,
} from "@/logic/services/financeService";
import DefaultTable from "../DefaultTable";
import { SelectCategory } from "../SelectCategory";
import { SelectSubCategory } from "../SelectSubCategory";

interface LoginPayload {
  country: string;
  email: string;
  companyName: string;
}

const countries = [
  { code: UAE, name: "United Arab Emirates", flag: "🇦🇪" },
  { code: SA, name: "Saudi Arabia", flag: "🇸🇦" },
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

const LoginForm = () => {
  const [existingUser, setexistingUser] = useState<Customer | null>();
  const [isFormSubmitted, setisFormSubmitted] = useState(false);
  //   const [canFetchProviders, setcanFetchProviders] = useState(false);

  const { mutate: createConsent, isLoading: isCreatingConsent } =
    useCreateConsent((result: CreateConsentResponse) => {
      console.log("consent created successfullu");
      console.log(result);
      window.open(result.data.authorizationLink, "_blank");
    });

  const { mutate: createCustomer, isLoading: isCreatingCustomer } =
    useCreateCustomer();

  const {
    data: generated_token,
    isLoading: isCreatingToken,
    isError,
    error,
  } = useGenerateToken({
    onSuccess: () => {
      toast({ title: "refetch providers" });
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
      if (userExist) setexistingUser(userExist);

      // const p: CreateCustomerPayload = {
      //   type: "Business",
      //   email: formik.values.email,
      //   nationalId: "ffffffffff",
      // };
      // createCustomer(p);
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

  const handleSelectBank = (bank: BankProvider) => {
    console.log("bank");
    console.log(bank);
    console.log(existingUser);
    if (formik.values.country == SA) {
      if (existingUser) {
        const p: CreateConsentPayload = {
          customerId: existingUser.id,
          providerId: bank.id,
          permissions: [],
        };
        createConsent(p);
        return;
      }

      //   const isBankSupported = isBankStatusOk(bank);
      //   console.log("isBankSupported ", isBankSupported);
      return;
    }

    // const p: CreateCustomerPayload = {
    //   type: "Business",
    //   email: "richard.bathiebo.9@gmail.com",
    //   nationalId: "ffffffffff",
    // };
    // createCustomer(p);
  };

  const handleSelectBankSA = (bank: BankProvider) => {
    console.log("bank ", bank);
    console.log("existingUser ", existingUser);
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
        <div className="min-w-[500px]">
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
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {countries.map((country) => {
                          return (
                            <SelectItem
                              value={country.code}
                            >{`${country.flag} ${country.name}`}</SelectItem>
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

          {providers && isFormSubmitted && formik.values.country == SA && (
            <div>
              <h1>Open Banking - Bank Coverage</h1>
              {/* <BanksTable
                handleSelectBank={handleSelectBank}
                providers={defaultBanksList}
              /> */}

              <DefaultTable
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
        </div>
      )}
    </div>
  );
};

export default LoginForm;
