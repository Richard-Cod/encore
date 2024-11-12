import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { AppConstants } from "@/constants";

const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

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
      ).then(response => {
        // Insert account_id at the beginning of each transaction in the data array
        const transactionsWithAccountId = response.data.map(transaction => ({
          account_id: accountId,
          ...transaction,
        }));
        return { data: transactionsWithAccountId };
      })
    );

    const list_of_Transactions = await Promise.all(promises);
    console.log("Response Data:", list_of_Transactions);

    return NextResponse.json({ list_of_Transactions });

  } catch (error) {
    const e = error as AxiosError;
    console.error("Error fetching Transactions:", e);

    if (e.response?.status === 401) {
      return new Response("Unauthorized access - invalid token", {
        status: 401,
      });
    }

    return new Response("Error fetching Transactions", {
      status: 500,
    });
  }
}
