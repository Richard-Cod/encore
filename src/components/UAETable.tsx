import React, { Provider, useState } from "react";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { formatDirectoryName } from "@/logic/services/azureUploadService";
import { APP_ENVS } from "@/config/envs";
import { Button } from "./ui/button";
import { FileIcon, LinkIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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

  const [isModalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

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
        // window.open(linkEntityUrl, "_blank");

        setIframeUrl(linkEntityUrl);
        setModalOpen(true); // Ouvrir la modal avec le lien

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
          <TableHead>Banks Supported</TableHead>
          <TableHead></TableHead>
          {/* <TableHead>Address</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultUAEbanks
          .toSorted((a, b) => (a.name > b.name ? 1 : -1))
          .map((provider, key) => {
            const isASupportedBank = provider.isActive;
            const trigger = (
              <TableCell className="flex space-x-2 items-center ">
                <span>{provider.name}</span>
              </TableCell>
            );
            const theRow = (
              <TableRow
                onClick={() => {
                  handleSubmit(provider.name);
                }}
                key={key}
                className="hover:bg-gray-100  cursor-pointer "
              >
                <TableCell className="flex space-x-2 items-center">
                  <span>{provider.name}</span>
                </TableCell>

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
                        : "text-green-700 font-semibold"
                    }
                  >
                    {isASupportedBank ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <LinkIcon className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Connect to Bank Account</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      // <LinkIcon className="w-4 h-4" />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FileIcon className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Upload Digital Statements</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </span>
                </TableCell>
              </TableRow>
            );

            return isASupportedBank ? (
              theRow
            ) : (
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
                trigger={theRow}
              />
            );
          })}
        {/* 
        <Button
          onClick={() => {
            setIframeUrl(
              "https://link.eumlet.com/entity?redirect_url=google.com&nonce=7d294f2a195303e3fc77e0407a84a166&customer_id=e4609a5d-daa2-4ac7-8cef-a3c8f39a347a&end_user_id=a14b3295-7a92-4d63-841e-e24ba0b7c408&corporate=true"
            );
            setModalOpen(true); // Ouvrir la modal avec le lien
          }}
        >
          click to open
        </Button> */}
      </TableBody>

      <AlertDialog open={isModalOpen} onOpenChange={(val) => setModalOpen(val)}>
        {/* <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> */}
        <AlertDialogContent className="w-full max-w-4xl border-0 ">
          <iframe
            src={iframeUrl}
            className="w-full sm:h-[600px] md:h-[800px] border-0"
            title="Authorization"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            {/* <AlertDialogAction onClick={() => onOk()}>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Table>
  );
}

export default UAETable;
