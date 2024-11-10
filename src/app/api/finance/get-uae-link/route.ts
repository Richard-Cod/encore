// app/api/authenticate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, companyName } = await req.json();

    if (!email || !companyName) {
      return NextResponse.json(
        { error: "Email and Company name are required." },
        { status: 400 }
      );
    }

    // Step 1: Authenticate and get JWT access token
    const authResponse = await fetch(
      "https://api.eumlet.com/api/v1/auth/rtbs_auth_admin",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-secret-key": "6eq6Vpc3c8tziCThs4LnKihjpeHIGAa0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          picture: "string",
          name: companyName,
          login_method: "rtbs",
        }),
      }
    );

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate");
    }

    const authData = await authResponse.json();
    const jwtAccessToken = authData.rtbs_token;

    // Step 2: Fetch end_user_id
    const financeResponse = await fetch(
      "https://api.eumlet.com/api/v1/finance/lean/customer/",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${jwtAccessToken}`,
        },
      }
    );

    if (!financeResponse.ok) {
      throw new Error("Failed to retrieve customer data");
    }

    const financeData = await financeResponse.json();
    const endUserId = financeData.end_user_id;

    // Step 3: Submit company data to Orbii API
    const companyId = generateCompanyId();
    const orbiiUrl = `https://api.orbii.ai/add-company?company_id=${companyId}&user=contoso&password=dfgdfFZ5N4v78&email=${encodeURIComponent(
      email
    )}&company_name=${encodeURIComponent(companyName)}&client=contoso`;

    const orbiiResponse = await fetch(orbiiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: "",
    });

    if (!orbiiResponse.ok) {
      throw new Error("Failed to submit company data to Orbii API");
    }

    // Step 4: Fetch entity link URL
    const linkUrl = `https://api.eumlet.com/api/v1/link/entity?redirect_url=google.com&corporate=true&end_user_id=${endUserId}`;

    const linkResponse = await fetch(linkUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${jwtAccessToken}`,
        "User-ID": "contoso",
      },
    });

    if (!linkResponse.ok) {
      throw new Error("Failed to connect to the entity link");
    }

    const linkData = await linkResponse.json();
    const linkEntityUrl = linkData.link_entity_url;

    if (!linkEntityUrl) {
      throw new Error("No link_entity_url found in the response.");
    }

    return NextResponse.json({ linkEntityUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "error.message" }, { status: 500 });
  }
}

function generateCompanyId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
