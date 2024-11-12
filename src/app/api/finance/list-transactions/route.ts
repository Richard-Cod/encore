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
    const backendApiUrl = "https://sandbox.sparefinancial.sa/api/v1.0";
    const accountIds = payload.accountIds as string[];
    console.log("all ids ", accountIds);

    const promises = accountIds.map((accountId) =>
      axios.post<GetProvidersResponse>(
        `${backendApiUrl}/ais/Transaction/List?consentId=${payload.consentId}&page=1&perPage=20&accountId=${accountId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      )
    );

    const responses = await Promise.all(promises);
    const allData = responses.map((response, index) => ({
      account_id: accountIds[index],
      data: response.data.data.map((transaction) => ({
        account_id: accountIds[index],
        ...transaction,
      })),
    }));

    console.log(allData);

    return NextResponse.json(allData);
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error fetching Transactions:");
    console.log(e);
    console.log(e.response?.status);
    console.log(e.response?.data);

    if (e.response?.status == 401) {
      return new Response("Error fetching Transactions", {
        status: 401,
      });
    }

    return new Response("Error fetching Transactions", {
      status: 500,
    });
  }
}
