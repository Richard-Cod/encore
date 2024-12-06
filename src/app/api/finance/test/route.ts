// import { APP_ENVS } from "@/config/envs";
// import {
//   formatDirectoryName,
//   uploadJsonToAzure,
//   UploadProps,
// } from "@/logic/services/azureUploadService";
// import financeService, {
//   AllProcessPayload,
//   CreateCustomerPayload,
//   Customer,
//   GetProvidersResponse,
//   ListbalancesPayload,
//   ListTransactionsPayload,
// } from "@/logic/services/financeService";
// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const ourPayload = body.payload as AllProcessPayload;
//     const jwtAccessToken = body.jwtAccessToken as string;

//     const { customerId, providerId, consentId, formPayload } = ourPayload;

//     const {
//       country,
//       email,
//       companyname,
//       category,
//       subCategory,
//       bankname,
//       clientname,
//     } = formPayload;
//     console.log("ourPayload ", ourPayload);
//     const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;

//     const { data: allAccountsResult } = await axios.get<GetProvidersResponse>(
//       `${backendApiUrl}/ais/Account/List?consentId=${consentId}&page=1&perPage=20`,
//       {
//         headers: {
//           Authorization: `Bearer ${jwtAccessToken}`,
//         },
//       }
//     );

//     if (allAccountsResult.data.length == 0) {
//       return NextResponse.json(
//         { message: "No accounts found", ok: false },
//         { status: 400 }
//       );
//     }

//     console.log("next step");

//     // // Liste les balances
//     const accountIds = allAccountsResult.data.map((val) => val.id);
//     let balancePayload: ListbalancesPayload = {
//       accountIds,
//     };

//     const promises = accountIds.map((accountId) =>
//       axios.get<GetProvidersResponse>(
//         `${backendApiUrl}/ais/Balance/Get?accountId=${accountId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${jwtAccessToken}`,
//           },
//         }
//       )
//     );
//     const responses = await Promise.all(promises);
//     responses.forEach((response, index) => {
//       console.log(
//         `Response for accountId ${accountIds[index]}:`,
//         response.data
//       );
//     });
//     const listbalanceResult = responses.map((response, index) => ({
//       ...response.data,
//       account_id: accountIds[index],
//     }));
//     // // Liste les transactions

//     const p: ListTransactionsPayload = {
//       consentId,
//       accountIds,
//     };

//     const promisesTransactions = accountIds.map((accountId) =>
//       axios.post<GetProvidersResponse>(
//         `${backendApiUrl}/ais/Transaction/List?consentId=${consentId}&page=1&perPage=20&accountId=${accountId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${jwtAccessToken}`,
//           },
//         }
//       )
//     );

//     const responsesTransactions = await Promise.all(promises);
//     responsesTransactions.forEach((response, index) => {
//       console.log(
//         `Response for accountId ${accountIds[index]}:`,
//         response.data
//       );
//     });
//     const allDataTransactions = responsesTransactions.map(
//       (response, index) => ({
//         ...response.data,
//         account_id: accountIds[index],
//       })
//     );

//     const companyFormatted = formatDirectoryName(companyname, bankname);

//     const dataJson = {
//       directoryName: companyFormatted,
//       fileName: "data.json",
//       data: {
//         country,
//         email,
//         companyname,
//         category,
//         subCategory,
//         bankname,
//         clientname: clientname || "orbii",
//       },
//     };

//     const accountsJson = {
//       directoryName: companyFormatted,
//       fileName: "list-of-accounts.json",
//       data: {
//         ...allAccountsResult?.data,
//       },
//     };

//     const transactionsJson = {
//       directoryName: companyFormatted,
//       fileName: "transactions.json",
//       data: {
//         list_of_Transactions: allDataTransactions,
//       },
//     };

//     const balancesJson = {
//       directoryName: companyFormatted,
//       fileName: "balances.json",
//       data: {
//         list_of_Balances: listbalanceResult,
//       },
//     };

//     // Utilisation de Promise.all pour exécuter toutes les promesses en parallèle
//     Promise.all([
//       makeUpload(dataJson),
//       makeUpload(accountsJson),
//       makeUpload(transactionsJson),
//       makeUpload(balancesJson),
//     ])
//       .then(() => {
//         console.log("Tous les fichiers ont été uploadés avec succès.");
//       })
//       .catch((error) => {
//         console.error("Erreur lors de l'upload des fichiers :", error);
//       });

//     // Logs pour afficher les résultats
//     console.log("Liste des comptes ");
//     console.log(allAccountsResult);

//     console.log("Liste des transactions ");
//     console.log(transactionsJson);
//     return NextResponse.json({ hello: "wolrd" });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       { message: "Something went wrong", ok: false },
//       { status: 500 }
//     );
//   }
// }

import { APP_ENVS } from "@/config/envs";
import {
  formatDirectoryName,
  uploadJsonToAzure,
  UploadProps,
} from "@/logic/services/azureUploadService";
import {
  DataItemAccounts,
  ListAccountsResult,
} from "@/logic/services/financeService";
import axios from "axios";
import { NextResponse } from "next/server";

function sleep(func: Function, ms: number) {
  return new Promise((resolve) => setTimeout(func, ms));
}

export const maxDuration = 60 * 5;
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payload, jwtAccessToken } = body;
    const {
      customerId,
      providerId,
      consentId,
      formPayload: {
        country,
        email,
        companyname,
        category,
        subCategory,
        bankname,
        clientname,
      },
    } = payload;

    const backendApiUrl = `https://sandbox.sparefinancial.sa/api/v1.0`;
    // Étape 1 : Récupérer les comptes

    // const allAccountsResult = await sleep(
    //   () => fetchAccounts(backendApiUrl, consentId, jwtAccessToken),
    //   10
    // );

    const allAccountsResult: DataItemAccounts[] = await new Promise((resolve) =>
      setTimeout(() => {
        fetchAccounts(backendApiUrl, consentId, jwtAccessToken).then((v) => {
          resolve(v);
        });
      }, 5_000)
    );

    console.log("allAccountsResult ", allAccountsResult);
    if (allAccountsResult.length === 0) {
      return NextResponse.json(
        { message: "No accounts found", ok: false },
        { status: 400 }
      );
    }

    // Étape 2 : Récupérer les balances
    const accountIds = allAccountsResult.map((val: any) => val.id);

    const listbalanceResult = await new Promise((resolve) =>
      setTimeout(() => {
        fetchBalances(backendApiUrl, accountIds, jwtAccessToken).then((v) => {
          resolve(v);
        });
      }, 1_000)
    );

    // Étape 3 : Récupérer les transactions

    const allDataTransactions = await new Promise((resolve) =>
      setTimeout(() => {
        fetchTransactions(
          backendApiUrl,
          consentId,
          accountIds,
          jwtAccessToken
        ).then((v) => {
          resolve(v);
        });
      }, 10_000)
    );

    // return NextResponse.json({ message: "Tout OK", ok: true }, { status: 200 });

    // Étape 4 : Préparer les fichiers à uploader
    const companyFormatted = formatDirectoryName(companyname, bankname);
    const dataToUpload = prepareUploadData(
      companyFormatted,
      {
        country,
        email,
        companyname,
        category,
        subCategory,
        bankname,
        clientname: clientname || "orbii",
      },
      allAccountsResult,
      listbalanceResult,
      allDataTransactions
    );

    // Étape 5 : Uploader les fichiers en parallèle
    uploadAllFiles(dataToUpload);

    return NextResponse.json({ message: "Files uploaded successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}

// Fonction pour récupérer les comptes
async function fetchAccounts(
  backendApiUrl: string,
  consentId: string,
  jwtAccessToken: string
) {
  const { data } = await axios.get(
    `${backendApiUrl}/ais/Account/List?consentId=${consentId}&page=1&perPage=20`,
    {
      headers: { Authorization: `Bearer ${jwtAccessToken}` },
    }
  );
  return data.data;
}

// Fonction pour récupérer les balances
async function fetchBalances(
  backendApiUrl: string,
  accountIds: string[],
  jwtAccessToken: string
) {
  const promises = accountIds.map((accountId) =>
    axios.get(`${backendApiUrl}/ais/Balance/Get?accountId=${accountId}`, {
      headers: { Authorization: `Bearer ${jwtAccessToken}` },
    })
  );
  const responses = await Promise.all(promises);
  return responses.map((response, index) => ({
    ...response.data,
    account_id: accountIds[index],
  }));
}

// Fonction pour récupérer les transactions
async function fetchTransactions(
  backendApiUrl: string,
  consentId: string,
  accountIds: string[],
  jwtAccessToken: string
) {
  const promises = accountIds.map((accountId) =>
    axios.post(
      `${backendApiUrl}/ais/Transaction/List?consentId=${consentId}&page=1&perPage=20&accountId=${accountId}`,
      {},
      {
        headers: { Authorization: `Bearer ${jwtAccessToken}` },
      }
    )
  );
  const responses = await Promise.all(promises);
  return responses.map((response, index) => ({
    ...response.data,
    account_id: accountIds[index],
  }));
}

// Fonction pour préparer les données à uploader
function prepareUploadData(
  companyFormatted: string,
  formPayload: any,
  allAccountsResult: any,
  listbalanceResult: any,
  allDataTransactions: any
) {
  return [
    {
      directoryName: companyFormatted,
      fileName: "data.json",
      data: formPayload,
    },
    {
      directoryName: companyFormatted,
      fileName: "list-of-accounts.json",
      data: { ...allAccountsResult },
    },
    {
      directoryName: companyFormatted,
      fileName: "transactions.json",
      data: { list_of_Transactions: allDataTransactions },
    },
    {
      directoryName: companyFormatted,
      fileName: "balances.json",
      data: { list_of_Balances: listbalanceResult },
    },
  ];
}

// Fonction pour uploader tous les fichiers
async function uploadAllFiles(files: UploadProps[]) {
  await Promise.all(files.map((file) => makeUpload(file)));
}

const makeUpload = async (jsonData: any) => {
  try {
    if (!jsonData) {
      return NextResponse.json(
        { error: "No JSON data provided" },
        { status: 400 }
      );
    }

    const props = jsonData as UploadProps;

    const sasToken = APP_ENVS.credsForJson.token;
    const accountName = APP_ENVS.credsForJson.account_name;
    const containerName = APP_ENVS.credsForJson.container_name;
    const directoryName = props.directoryName;
    const blobName = props.fileName;

    if (!sasToken || !accountName || !containerName || !directoryName) {
      return NextResponse.json(
        { error: "Missing Azure configuration" },
        { status: 500 }
      );
    }

    // URL to create file
    const createFileUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${blobName}?resource=file&${sasToken}`;

    // Step 1: Create the file (via PUT request)
    const createFileResponse = await fetch(createFileUrl, {
      method: "PUT",
      headers: {
        "x-ms-version": "2020-04-08",
      },
    });

    if (!createFileResponse.ok) {
      throw new Error(
        "Error creating file: " + (await createFileResponse.text())
      );
    }

    console.log("File created successfully");

    // Step 2: Append the JSON data (via PATCH request)
    const appendUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${blobName}?action=append&position=0&${sasToken}`;
    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));

    const appendDataResponse = await fetch(appendUrl, {
      method: "PATCH",
      headers: {
        "x-ms-version": "2020-04-08",
      },
      body: jsonDataBuffer,
    });

    if (!appendDataResponse.ok) {
      throw new Error(
        "Error appending data: " + (await appendDataResponse.text())
      );
    }

    console.log("Data appended successfully");

    // Step 3: Flush the data (via PATCH request)
    const flushUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${blobName}?action=flush&position=${jsonDataBuffer.length}&${sasToken}`;

    const flushDataResponse = await fetch(flushUrl, {
      method: "PATCH",
      headers: {
        "x-ms-version": "2020-04-08",
      },
    });

    if (!flushDataResponse.ok) {
      throw new Error(
        "Error flushing data: " + (await flushDataResponse.text())
      );
    }

    console.log("File flushed successfully makeUpload");
    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
