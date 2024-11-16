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
import { SA, saudi_defaultBanksList } from "@/constants";
import { ModalCmp } from "./ModalCmp";
import UploadFileComponent from "./UploadFileCmp";
import { AlertDialogCancel, AlertDialogFooter } from "./ui/alert-dialog";
import { formatDirectoryName } from "@/logic/services/azureUploadService";
import { APP_ENVS } from "@/config/envs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { FileIcon, LinkIcon } from "lucide-react";

// interface BanksTableProps {
//   providers: GetProvidersResponse["data"];
//   handleSelectBank: any;
//   country: string;
// }

function DefaultTable({
  companyName,
  providers,
  handleSelectBankSA,
}: {
  providers: BankProvider[];
  handleSelectBankSA: any;
  companyName: string;
}) {
  const data = saudi_defaultBanksList;

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
        {data
          .toSorted((a, b) => (a.bank > b.bank ? 1 : -1))
          .map((provider, key) => {
            const isASupportedBank = isBankStatusOkSaudi(
              provider.bank,
              providers
            );
            // const trigger = (
            //   <TableCell className="flex space-x-2 items-center cursor-pointer hover:underline">
            //     <span>{provider.bank}</span>
            //   </TableCell>
            // );

            const theRow = (
              <TableRow
                onClick={() =>
                  isASupportedBank
                    ? handleSelectBankSA(isASupportedBank)
                    : console.log("")
                }
                key={key}
                className="hover:bg-gray-100 cursor-pointer "
              >
                <TableCell className="flex space-x-2 items-center ">
                  <span>{provider.bank}</span>
                </TableCell>

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
                      containerName={"pdf-prod-ksa"}
                      directoryName={formatDirectoryName(
                        companyName,
                        provider.bank
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
      </TableBody>
    </Table>
  );
}

export default DefaultTable;
