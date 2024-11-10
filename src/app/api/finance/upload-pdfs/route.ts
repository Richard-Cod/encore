// pages/api/finance/uploadPDF.ts

import { NextResponse } from "next/server";
import { APP_ENVS } from "@/config/envs";

export async function POST(req: Request) {
  try {
    // Récupérer les données de la requête
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const directoryName = formData.get("directoryName");
    const containerName = formData.get("containerName");

    console.log("file ", file);

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
    // const containerName = APP_ENVS.CONTAINER_NAME;
    // const directoryName = "pdfs"; // Le nom du répertoire dans lequel vous souhaitez uploader les fichiers
    const fileName = file.name;

    if (!sasToken || !accountName || !containerName || !directoryName) {
      return NextResponse.json(
        { error: "Missing Azure configuration" },
        { status: 500 }
      );
    }

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
