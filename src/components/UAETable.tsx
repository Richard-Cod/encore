import React, { Provider } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHeadCell,
// } from '@shadcn/ui';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "./ui/table";
import {
  BankProvider,
  GetProvidersResponse,
  // isBankStatusOk,
  isBankStatusOkSaudi,
  // isBankStatusOk,
  ProviderStatus,
} from "@/logic/services/financeService";
import { defaultUAEbanks, SA, saudi_defaultBanksList } from "@/constants";
import { ModalCmp } from "./ModalCmp";
import UploadFileComponent from "./UploadFileCmp";
import { AlertDialogCancel, AlertDialogFooter } from "./ui/alert-dialog";
import { formatDirectoryName } from "@/logic/services/azureUploadService";
import { APP_ENVS } from "@/config/envs";

// interface BanksTableProps {
//   providers: GetProvidersResponse["data"];
//   handleSelectBank: any;
//   country: string;
// }

function UAETable({
  email,
  companyName,
  // providers,
  handleSelectBankSA,
}: {
  // providers: BankProvider[];
  handleSelectBankSA: any;
  companyName: string;
  email: string;
}) {
  const data = saudi_defaultBanksList;

  const handleSubmit = async (bankName: string) => {
    if (email && companyName) {
      try {
        // Call the Next.js API
        const res = await fetch("/api/finance/get-uae-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, companyName }),
        });

        if (!res.ok) {
          throw new Error("Authentication failed");
        }

        const data = await res.json();
        const linkEntityUrl = data.linkEntityUrl;

        // Open the modal with the link
        window.open(linkEntityUrl, "_blank");

        // openModal(linkEntityUrl);
      } catch (error) {
        console.error(error);
        // alert('Error: ' + error.message);
      }
    } else {
      alert("Please fill out both fields.");
    }
  };

  return (
    <Table className="w-full bg-white shadow-md rounded-lg">
      <TableHeader>
        <TableRow className="border-b">
          <TableHead>Bank</TableHead>
          <TableHead>Supported</TableHead>
          {/* <TableHead>Address</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultUAEbanks
          .toSorted((a, b) => (a.name > b.name ? 1 : -1))
          .map((provider, key) => {
            const isASupportedBank = provider.isActive;
            const trigger = (
              <TableCell className="flex space-x-2 items-center cursor-pointer hover:underline">
                <span>{provider.name}</span>
              </TableCell>
            );

            return (
              <TableRow key={key} className="hover:bg-gray-100">
                {!isASupportedBank ? (
                  <ModalCmp
                    Content={
                      <div>
                        <UploadFileComponent
                          containerName={APP_ENVS.uaeContainerName}
                          directoryName={formatDirectoryName(
                            companyName,
                            provider.name
                          )}
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </div>
                    }
                    trigger={trigger}
                  />
                ) : (
                  <TableCell
                    onClick={() => {
                      handleSubmit(provider.name);
                    }}
                    className="flex space-x-2 items-center cursor-pointer hover:underline"
                  >
                    <span>{provider.name}</span>
                  </TableCell>
                )}
                {/* <TableCell>{isASupportedBank ? ""} </TableCell> */}
                {/* <TableCell>{provider.status}</TableCell> */}
                {/* <TableCell>{provider.status}</TableCell> */}
                {/* <TableCell>
                        <span
                          className={
                            provider.status === ProviderStatus.Active
                              ? "text-green-500 font-semibold"
                              : "text-red-500 font-semibold"
                          }
                        >
                          {provider.status === ProviderStatus.Active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </TableCell> */}
                <TableCell>
                  <span
                    className={
                      isASupportedBank
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {isASupportedBank ? "Yes" : "No"}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

export default UAETable;
