// pages/api/finance/uploadPDF.ts

import { NextResponse } from "next/server";
import { APP_ENVS } from "@/config/envs";
import { UploadProps } from "@/logic/services/azureUploadService";
// import { UploadProps } from "@/logic/services/azureUploadService";

export async function POST(req: Request) {
  try {
    // Récupérer les données de la requête
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const directoryName = formData.get("directoryName");
    const containerName = formData.get("containerName");
    const userData = formData.get("userData");
    console.log("userData ", userData);
    console.log("containerName ", containerName);
    console.log("file ", file);

    // return NextResponse.json(
    //   { data: JSON.parse(userData!.toString()) },
    //   { status: 200 }
    // );

    // return;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // if (!file || !(file instanceof File)) {
    //   return NextResponse.json(
    //     { error: "No PDF file provided" },
    //     { status: 400 }
    //   );
    // }

    const sasToken = APP_ENVS.SAS_TOKEN;
    const accountName = APP_ENVS.ACCOUNT_NAME;
    const fileName = file.name;
    if (!sasToken || !accountName || !containerName || !directoryName) {
      return NextResponse.json(
        { error: "Missing Azure configuration" },
        { status: 500 }
      );
    }

    console.log("----");
    console.log(sasToken);
    console.log(accountName);
    console.log(containerName);
    console.log(directoryName);
    console.log("----2");

    const filePayload: UploadProps = {
      directoryName: directoryName.toString(),
      fileName: "data.json",
      data: JSON.parse(userData!.toString()),
    };
    const uploadVars: UploadVars = {
      accountName: accountName,
      containerName: containerName.toString(),
      directoryName: directoryName.toString(),
      sasToken: sasToken,
    };

    console.log("sent");
    await uploadOneFile(filePayload, uploadVars);
    console.log("done uploading data");

    // URL pour créer un fichier (via la méthode PUT)
    const createFileUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${fileName}?resource=file&${sasToken}`;

    // Étape 1 : Créer le fichier (via la requête PUT)
    const createFileResponse = await fetch(createFileUrl, {
      method: "PUT",
      headers: {
        "x-ms-version": "2020-04-08",
        "Content-Length": "0", // Le fichier est vide lors de la création
      },
    });

    if (!createFileResponse.ok) {
      throw new Error(
        "Error creating file: " + (await createFileResponse.text())
      );
    }

    console.log("File created successfully");

    // Étape 2 : Uploader le fichier PDF dans Azure Blob Storage
    const uploadUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${fileName}?action=append&position=0&${sasToken}`;
    const fileBuffer = await file.arrayBuffer();

    const uploadResponse = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "x-ms-version": "2020-04-08",
        "Content-Length": fileBuffer.byteLength.toString(),
      },
      body: Buffer.from(fileBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error("Error uploading file: " + (await uploadResponse.text()));
    }

    console.log("File uploaded successfully");

    // Étape 3 : Flusher les données pour finaliser l'upload
    const flushUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${fileName}?action=flush&position=${fileBuffer.byteLength}&${sasToken}`;

    const flushResponse = await fetch(flushUrl, {
      method: "PATCH",
      headers: {
        "x-ms-version": "2020-04-08",
      },
    });

    if (!flushResponse.ok) {
      throw new Error("Error flushing data: " + (await flushResponse.text()));
    }

    console.log("File flushed successfully");

    // Retourner l'URL du fichier uploadé
    const fileUrl = `https://${accountName}.dfs.core.windows.net/${containerName}/${directoryName}/${fileName}`;
    return NextResponse.json({
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

interface UploadVars {
  accountName: string;
  containerName: string;
  directoryName: string;
  sasToken: string;
}
const uploadOneFile = async (jsonData: any, uploadProps: UploadVars) => {
  try {
    if (!jsonData) {
      return NextResponse.json(
        { error: "No JSON data provided" },
        { status: 400 }
      );
    }

    const props = jsonData;

    const blobName = props.fileName;

    const { sasToken, accountName, containerName, directoryName } = uploadProps;

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
