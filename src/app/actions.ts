"use server";

import { AppConstants } from "@/constants";
import { authService } from "@/logic/services/financeService";
import { cookies } from "next/headers";

const getSessionUserFromDjango = async () => {
  const token = cookies().get(AppConstants.access_token_key)?.value;
  if (!token) return null;
  return authService.me(token);
};

export default getSessionUserFromDjango;
