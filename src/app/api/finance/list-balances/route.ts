// ais/Balance/History?accountId=4405352b-4dd7-45c9-9ac0-6f915ad1c34b
// pages/api/finance/getProviders.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { AppConstants } from "@/constants";
import { headers } from "next/headers";

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
    const accountIds = payload.accountIds as String[];
    console.log("all ids ", accountIds);

    const promises = accountIds.map((accountId) =>
      axios.get<GetProvidersResponse>(
        `${backendApiUrl}/ais/Balance/History?accountId=${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      )
    );

    const responses = await Promise.all(promises);
    const allData = responses.map((response, index) => {
      const accountId = accountIds[index];
      
      // Assuming `response.data` itself is the array containing balance entries
      const balances = Array.isArray(response.data) ? response.data : []; // Ensures data is an array
      return balances.map((balanceEntry) => ({
        ...balanceEntry,
        account_id: accountId, // Add account_id to each balance entry
      }));
    });

    // Flatten the array if you want a single list of balances
    const flattenedData = allData.flat();
    
    return NextResponse.json(flattenedData);
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error fetching balances:");
    console.log(e);
    console.log(e.response?.status);
    console.log(e.response?.data);
    if (e.response?.status == 401) {
      return new Response("Error fetching balances", {
        status: 401,
      });
    }

    return new Response("Error fetching balances", {
      status: 500,
    });
  }
}
