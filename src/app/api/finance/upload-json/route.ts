import { APP_ENVS } from "@/config/envs";
import { UploadProps } from "@/logic/services/azureUploadService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const jsonData = await req.json();

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

    console.log("File flushed successfully");
    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
