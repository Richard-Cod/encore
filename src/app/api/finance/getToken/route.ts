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
  try {
    const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;
    const headers = {
      accept: "application/json",
      "app-id": "i0T8BLfDW2lljtTUudVZO0NLp3fZ0O0DI347tsBGNcw=",
      "x-api-key": "Jh09I82VCp60dfiddnyboi8VA85BPniuoAc35DT02Y4=",
    };

    const response = await axios.get<GetProvidersResponse>(
      `${backendApiUrl}/authentication/Token`,
      { headers: headers }
    );

    return NextResponse.json(response.data);

    // res.status(200).json(response.data);
  } catch (error) {
    const e = error as any;
    console.error("Error getting token:");
    console.log(e.response?.status);
    console.log(e.response?.data);
    return new Response("Error getting token", {
      status: 500,
    });
  }
}
