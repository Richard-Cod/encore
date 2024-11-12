// ais/Balance/History?accountId=4405352b-4dd7-45c9-9ac0-6f915ad1c34b
// pages/api/finance/getProviders.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { AppConstants } from "@/constants";

// Define the backend API base URL here
const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

// Main handler function for the API endpoint
export async function POST(req: Request, res: Response) {
  try {
    // Parse request body
    const body = await req.json();
    console.log("Request Body:", body);

    // Extract JWT access token and payload
    const jwtAccessToken = body.jwtAccessToken;
    const payload = body.payload;
    const accountIds = payload.accountIds as string[];

    // Check if jwtAccessToken is provided
    if (!jwtAccessToken) {
      console.error("Missing jwtAccessToken");
      return new Response("Missing jwtAccessToken", {
        status: 400,
      });
    }

    // Logging all account IDs
    console.log("Account IDs:", accountIds);

    // Prepare requests to fetch balance history for each account ID
    const promises = accountIds.map((accountId) =>
      axios.get<GetProvidersResponse>(
        `${backendApiUrl}/ais/Balance/History?accountId=${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      ).then(response => ({
        accountId: accountId,
        history: response.data.history,
      }))
    );

    // Await all responses
    const list_of_Balances = await Promise.all(promises);

    // Log the full data for debugging
    console.log("Response Data:", list_of_Balances);

    // Return the processed data as JSON with the desired structure
    return NextResponse.json({ list_of_Balances });

  } catch (error) {
    const e = error as AxiosError;
    console.error("Error fetching balances:", e);

    // Handle specific status codes if needed
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
