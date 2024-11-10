export interface UploadProps {
  directoryName: string;
  fileName: string;
  data: any;
}

async function uploadPdfToAzure(props: UploadProps) {
  const response = await fetch("/api/finance/upload-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error uploading JSON:", errorData.error);
  } else {
    console.log("Upload successful");
  }
}

async function uploadJsonToAzure(props: UploadProps) {
  const response = await fetch("/api/finance/upload-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error uploading JSON:", errorData.error);
  } else {
    console.log("Upload successful");
  }
}

function formatDirectoryName(companyName: string, bankName: string): string {
  const today = new Date();

  // Format de la date en YYYYMMDD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Mois en 2 chiffres
  const day = String(today.getDate()).padStart(2, "0"); // Jour en 2 chiffres

  const formattedDate = `${year}${month}${day}`;

  // Formater le nom du répertoire
  const directoryName = `${companyName}-${bankName}-${formattedDate}`;

  return directoryName;
}

export { uploadJsonToAzure, formatDirectoryName, uploadPdfToAzure };
