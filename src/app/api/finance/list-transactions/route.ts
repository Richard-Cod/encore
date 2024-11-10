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
    const accountIds = payload.accountIds as String[];
    console.log("all ids ", accountIds);

    // const url = `${backendApiUrl}/ais/Transaction/List?consentId=${payload.consentId}&page=1&perPage=20&accountId=${accountIds[0]}`;
    // console.log(url);

    // const response = await axios.post<GetProvidersResponse>(url, {
    //   headers: {
    //     Authorization: `Bearer ${jwtAccessToken}`,
    //   },
    // });

    // console.log("response.data");
    // console.log(response.data);

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
    responses.forEach((response, index) => {
      console.log(
        `Response for accountId ${accountIds[index]}:`,
        response.data
      );
    });

    // const response = await axios.get<GetProvidersResponse>(
    //   `${backendApiUrl}/ais/Transaction/List?consentId=${payload.consentId}&page=1&perPage=20&accountId=${payload.accountId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${jwtAccessToken}`,
    //     },
    //   }
    // );
    const allData = responses.map((response, index) => ({
      ...response.data,
      account_id: accountIds[index],
    }));
    console.log();
    // const data = []

    return NextResponse.json(allData);
    // return NextResponse.json("allData");

    // res.status(200).json(response.data);
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

    // NextResponse.error()

    return new Response("Error fetching Transactions", {
      status: 500,
    });
  }
}
