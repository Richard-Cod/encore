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
  // const res = await request.json()
  const headersList = await headers();

  // const Authorization = headersList.get("Authorization");
  // console.log("req.headers ", Authorization);

  const body = await req.json();
  console.log("body ", body);

  const jwtAccessToken = body.jwtAccessToken;
  const countryCode = "SA";

  console.log();

  // const accessToken = req.cookies.get(AppConstants.access_token_key)?.value

  if (!jwtAccessToken) {
    return new Response("Missing jwtAccessToken", {
      status: 400,
    });

    // return NextResponse.json({ message: "Missing jwtAccessToken" });

    // return res.status(400).json({ message: "Missing jwtAccessToken" });
  }

  try {
    const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

    const response = await axios.get<GetProvidersResponse>(
      `${backendApiUrl}/ais/Provider/List?countryCode=${countryCode}`,
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
    console.error("Error fetching providers:");
    console.log(e.response?.status);
    console.log(e.response?.data);
    if (e.response?.status == 401) {
      return new Response("Error fetching providers", {
        status: 401,
      });
    }

    // NextResponse.error()

    return new Response("Error fetching providers", {
      status: 500,
    });
  }
}
