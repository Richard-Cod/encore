// pages/api/finance/getProviders.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { AppConstants } from "@/constants";
import { headers } from "next/headers";

// const backendApiUrl = process.env.BACKEND_API_URL; // Assurez-vous de définir cette URL dans .env.local

export async function POST(req: Request, res: Response) {
  // const res = await request.json()
  const headersList = await headers();

  // const Authorization = headersList.get("Authorization");
  // console.log("req.headers ", Authorization);

  const body = await req.json();
  console.log("body ", body);

  const jwtAccessToken = body.jwtAccessToken;
  const payload = body.payload;

  // const accessToken = req.cookies.get(AppConstants.access_token_key)?.value

  if (!jwtAccessToken) {
    return new Response("Missing jwtAccessToken", {
      status: 400,
    });
  }

  try {
    const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

    const response = await axios.post<GetProvidersResponse>(
      `${backendApiUrl}/ais/Customer/Create`,
      { ...payload },
      {
        headers: {
          Authorization: `Bearer ${jwtAccessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);

    // res.status(200).json(response.data);
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error creating customer:");
    console.log(e.response?.status);
    console.log(e.response?.data);
    // NextResponse.error()
    if (e.response?.status == 401) {
      return new Response("Error fetching providers", {
        status: 401,
      });
    }

    const accountExistsError = (e.response?.data as any).error || "";

    console.log(e.response?.status);
    console.log(accountExistsError);

    if (
      e.response?.status == 409 &&
      accountExistsError == "CUSTOMER_ALREADY_EXISTS"
    ) {
      return new Response("CUSTOMER_ALREADY_EXISTS", {
        status: 409,
      });
    }

    // const d = e.response?.data || "Error creating customer:"
    return new Response("Error creating customer:", {
      status: 500,
    });
  }
}
