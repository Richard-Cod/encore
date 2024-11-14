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
  project_name: "Orbii",
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

// const defaultCategories = [
//   {
//     id: 1,
//     name: "hello",
//   },
//   {
//     id: 2,
//     name: "ola",
//   },
// ];
// const defaultsubCategories = [
//   {
//     id: 1,
//     name: "hello",
//     category_id: 1,
//   },
//   {
//     id: 2,
//     name: "ola",
//     category_id: 1,
//   },
// ];

export type UserCredentials = {
  username: string;
  password: string;
};

export const credentialsList: UserCredentials[] = [
  { username: "comfi", password: "A7xk7p6KeKb3P5" },
  { username: "orbii", password: "dfgdfFZ5N4v78" },
  { username: "crossval", password: "7SqnueFZ5N4v78" },
  { username: "richard", password: "test" },
];

type BankUAE = {
  name: string;
  isActive: boolean;
};

export const defaultUAEbanks: BankUAE[] = [
  { name: "Emirates NBD", isActive: true },
  { name: "First Abu Dhabi Bank", isActive: false },
  { name: "Abu Dhabi Islamic Bank (ADIB)", isActive: false },
  { name: "Emirates Investment Bank", isActive: false },
  { name: "HSBC Bank Middle East", isActive: false },
  { name: "Arab Bank PLC", isActive: false },
  { name: "Citibank NA", isActive: false },
  { name: "Al Ahli Bank of Kuwait", isActive: false },
  { name: "Mashreq Bank", isActive: false },
  { name: "National Bank of Fujairah", isActive: false },
  { name: "Zand Bank", isActive: false },
  { name: "Emirates Islamic Bank", isActive: false },
  { name: "Commercial Bank of Dubai", isActive: false },
  { name: "ADCB", isActive: true },
  { name: "Abu Dhabi Commercial Bank", isActive: false },
  { name: "Dubai Islamic Bank", isActive: false },
  { name: "RAKBANK", isActive: false },
  { name: "Standard Chartered Bank", isActive: false },
  { name: "Al Hilal Bank", isActive: false },
  { name: "Ajman Bank", isActive: false },
  { name: "Arab African International Bank", isActive: false },
  { name: "Abu Dhabi Islamic Bank", isActive: false },
  { name: "Al khaliji France", isActive: false },
  { name: "Wio Bank", isActive: false },
];

export const saudi_defaultBanksList = [
  //
  {
    bank: "Spare Model Bank",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  //
  {
    bank: "Gulf International Bank",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Alinma Bank",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Arab National Bank",
    status: "ok",
    expectedGoLive: "N.A.",
  },
  {
    bank: "Saudi National Bank",
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

export const defaultCategories = [
  { id: 1, name: "Automotive" },
  { id: 2, name: "Business Support & Supplies" },
  { id: 3, name: "Computers or Electronics" },
  { id: 4, name: "Construction or Contractors" },
  { id: 5, name: "Education" },
  { id: 6, name: "Media and Entertainment" },
  { id: 7, name: "Food or Dining" },
  { id: 8, name: "Health or Medicine" },
  { id: 9, name: "Home or Garden" },
  { id: 10, name: "Legal or Financial " },
  { id: 11, name: "Manufacturing, Wholesale, Distribution" },
  { id: 12, name: "Merchants (Retail)" },
  { id: 13, name: "Miscellaneous" },
  { id: 14, name: "Personal Care & Services" },
  { id: 15, name: "Real Estate" },
  { id: 16, name: "Travel & Transportation" },
  { id: 17, name: "Information Technology Services" },
  { id: 18, name: "Utilities" },
];

export const defaultSubCategories = [
  { name: "Auto Accessories", category_id: 1 },
  { name: "Auto Dealers – New", category_id: 1 },
  { name: "Auto Dealers – Used", category_id: 1 },
  { name: "Detail & Carwash", category_id: 1 },
  { name: "Gas Stations", category_id: 1 },
  { name: "Motorcycle Sales or Repair", category_id: 1 },
  { name: "Rental or Leasing", category_id: 1 },
  { name: "Service, Repair & Parts ", category_id: 1 },
  { name: "Towing", category_id: 1 },
  { name: "Consultants", category_id: 2 },
  { name: "Employment Agency", category_id: 2 },
  { name: "Marketing or Communications", category_id: 2 },
  { name: "Office Supplies", category_id: 2 },
  { name: "Printing & Publishing", category_id: 2 },
  { name: "Computer Programming or Support ", category_id: 3 },
  { name: "Consumer Electronics or Accessories", category_id: 3 },
  {
    name: "Architects, Landscape Architects, Engineers or Surveyors",
    category_id: 4,
  },
  { name: "Blasting or Demolition", category_id: 4 },
  { name: "Building Materials & Supplies", category_id: 4 },
  { name: "Construction Companies", category_id: 4 },
  { name: "Electricians", category_id: 4 },
  { name: "Engineer, Survey", category_id: 4 },
  { name: "Environmental Assessments", category_id: 4 },
  { name: "Inspectors", category_id: 4 },
  { name: "Plaster & Concrete", category_id: 4 },
  { name: "Plumbers", category_id: 4 },
  { name: "Roofers", category_id: 4 },
  { name: "Adult & Continuing Education", category_id: 5 },
  { name: "Early Childhood Education", category_id: 5 },
  { name: "Educational Resources", category_id: 5 },
  { name: "Other Educational", category_id: 5 },
  { name: "Artists, Writers", category_id: 6 },
  { name: "Event Planners & Supplies", category_id: 6 },
  { name: "Golf Courses", category_id: 6 },
  { name: "Movies", category_id: 6 },
  { name: "Productions", category_id: 6 },
  { name: "Broadcasting", category_id: 6 },
  { name: "Desserts, Catering & Supplies", category_id: 7 },
  { name: "Fast Food & Carry Out ", category_id: 7 },
  { name: "Grocery, Beverage & Tobacco", category_id: 7 },
  { name: "Restaurants", category_id: 7 },
  { name: "Acupuncture", category_id: 8 },
  { name: "Assisted Living & Home Health Care", category_id: 8 },
  { name: "Audiologist", category_id: 8 },
  { name: "Chiropractic", category_id: 8 },
  { name: "Clinics & Medical Centers", category_id: 8 },
  { name: "Dental", category_id: 8 },
  { name: "Diet I& Nutrition", category_id: 8 },
  { name: "Laboratory, Imaging & Diagnostic", category_id: 8 },
  { name: "Massage Therapy", category_id: 8 },
  { name: "Mental Health", category_id: 8 },
  { name: "Nurse", category_id: 8 },
  { name: "Optical", category_id: 8 },
  { name: "Pharmacy, Drug & Vitamin Stores", category_id: 8 },
  { name: "Physical Therapy", category_id: 8 },
  { name: "Physicians & Assistants", category_id: 8 },
  { name: "Podiatry", category_id: 8 },
  { name: "Social Worker", category_id: 8 },
  { name: "Animal Hospital", category_id: 8 },
  { name: "Veterinary & Animal Surgeons", category_id: 8 },
  { name: "Antiques & Collectibles", category_id: 9 },
  { name: "Cleaning", category_id: 9 },
  { name: "Crafts, Hobbies & Sports", category_id: 9 },
  { name: "Flower Shops", category_id: 9 },
  { name: "Home Furnishings", category_id: 9 },
  { name: "Home Goods", category_id: 9 },
  { name: "Home Improvements & Repairs", category_id: 9 },
  { name: "Landscape & Lawn Service", category_id: 9 },
  { name: "Pest Control ", category_id: 9 },
  { name: "Pool Supplies & Service ", category_id: 9 },
  { name: "Security System & Services ", category_id: 9 },
  { name: "Accountants", category_id: 10 },
  { name: "Attorneys", category_id: 10 },
  { name: "Financial Institutions", category_id: 10 },
  { name: "Financial Services ", category_id: 10 },
  { name: "Insurance", category_id: 10 },
  { name: "Other Legal", category_id: 10 },
  { name: "Distribution, Import/Export", category_id: 11 },
  { name: "Manufacturing", category_id: 11 },
  { name: "Wholesale", category_id: 11 },
  { name: "Cards & Gifts ", category_id: 12 },
  { name: "Clothing & Accessories", category_id: 12 },
  { name: "Department Stores, Sporting Goods ", category_id: 12 },
  { name: "General", category_id: 12 },
  { name: "Jewelry", category_id: 12 },
  { name: "Shoes", category_id: 12 },
  { name: "Civic Groups", category_id: 13 },
  {
    name: "Funeral Service Providers & Cemetaries",
    category_id: 13,
  },
  { name: "Miscellaneous", category_id: 13 },
  { name: "Animal Care & Supplies", category_id: 14 },
  { name: "Barber & Beauty Salons", category_id: 14 },
  { name: "Beauty Supplies", category_id: 14 },
  { name: "Dry Cleaners & Laundromats", category_id: 14 },
  { name: "Exercise & Fitness", category_id: 14 },
  { name: "Massage & Body Works", category_id: 14 },
  { name: "Nail Salons", category_id: 14 },
  { name: "Shoe Repairs", category_id: 14 },
  { name: "Tailors", category_id: 14 },
  { name: "Agencies & Brokerage ", category_id: 15 },
  { name: "Agents & Brokers", category_id: 15 },
  { name: "Apartment & Home Rental ", category_id: 15 },
  { name: "Mortgage Broker & Lender ", category_id: 15 },
  { name: "Property Management ", category_id: 15 },
  { name: "Title Company ", category_id: 15 },
  { name: "Hotel", category_id: 16 },
  { name: "Packaging & Shipping", category_id: 16 },
  { name: "Moving & Storage", category_id: 16 },
  { name: "Transportation", category_id: 16 },
  { name: "Travel & Tourism", category_id: 16 },
  {
    name: "Software Development and IT Solutions",
    category_id: 17,
  },
  { name: "Cloud Computing and Hosting", category_id: 17 },
  { name: "Cybersecurity Services", category_id: 17 },
  { name: "Gas distributor", category_id: 18 },
  { name: "Telecommunication operator", category_id: 18 },
  { name: "Electricty distributor", category_id: 18 },
  { name: "Water distributor", category_id: 18 },
];
