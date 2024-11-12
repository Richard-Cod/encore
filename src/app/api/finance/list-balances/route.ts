import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { AppConstants } from "@/constants";

const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    console.log("Request Body:", body);

    const jwtAccessToken = body.jwtAccessToken;
    const payload = body.payload;
    const accountIds = payload.accountIds as string[];

    if (!jwtAccessToken) {
      console.error("Missing jwtAccessToken");
      return new Response("Missing jwtAccessToken", {
        status: 400,
      });
    }

    console.log("Account IDs:", accountIds);

    const promises = accountIds.map(async (accountId) => {
      const response = await axios.get<GetProvidersResponse>(
        `${backendApiUrl}/ais/Balance/History?accountId=${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );

      // Log the response data to identify the structure
      console.log(`Response for accountId ${accountId}:`, response.data);

      // Adjusting structure: wrap response data in object
      return {
        accountId: accountId,
        data: response.data,  // Keeping the raw response for now to inspect the data
      };
    });

    const list_of_Balances = await Promise.all(promises);

    console.log("Response Data:", list_of_Balances);

    return NextResponse.json({ list_of_Balances });

  } catch (error) {
    const e = error as AxiosError;
    console.error("Error fetching balances:", e);

    if (e.response?.status === 401) {
      return new Response("Unauthorized access - invalid token", {
        status: 401,
      });
    }

    return new Response("Error fetching balances", {
      status: 500,
    });
  }
}
