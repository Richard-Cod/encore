// pages/api/finance/getProviders.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { AppConstants } from "@/constants";
import { headers } from "next/headers";

// const backendApiUrl = process.env.BACKEND_API_URL; // Assurez-vous de définir cette URL dans .env.local

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  console.log("body ", body);
  const jwtAccessToken = body.jwtAccessToken;
  const payload = body.payload;
  if (!jwtAccessToken) {
    return new Response("Missing jwtAccessToken", {
      status: 400,
    });
  }

  try {
    const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

    const response = await axios.post<GetProvidersResponse>(
      `${backendApiUrl}/ais/Consent/Create`,
      {
        ...payload,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtAccessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);

    // res.status(200).json(response.data);
  } catch (error) {
    const e = error as any;
    console.error("Error creating consent:");
    console.log(e.response?.status);
    console.log(e.response?.data);
    if (e.response?.status == 401) {
      return new Response("Error creating consent", {
        status: 401,
      });
    }

    // NextResponse.error()

    return new Response("Error creating consent", {
      status: 500,
    });
  }
}
