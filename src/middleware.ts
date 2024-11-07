import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { API_BASE_URL, AppConstants, ROUTES } from "./constants";
import axios, { AxiosError } from "axios";

export async function middleware(req: any) {
  return NextResponse.next();
}

// Ajouter le middleware aux pages protégées
export const config = {
  matcher: ["/"],
  //   matcher: ['/login'],
};
