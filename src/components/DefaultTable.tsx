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
          <TableHead>Bank</TableHead>
          <TableHead>Supported</TableHead>
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
            const trigger = (
              <TableCell className="flex space-x-2 items-center cursor-pointer hover:underline">
                <span>{provider.bank}</span>
              </TableCell>
            );

            return (
              <TableRow key={key} className="hover:bg-gray-100">
                {!isASupportedBank ? (
                  <ModalCmp
                    Content={
                      <div>
                        <UploadFileComponent
                          containerName={APP_ENVS.CONTAINER_NAME!}
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
                    trigger={trigger}
                  />
                ) : (
                  <TableCell
                    onClick={() => handleSelectBankSA(isASupportedBank)}
                    className="flex space-x-2 items-center cursor-pointer hover:underline"
                  >
                    <span>{provider.bank}</span>
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

export default DefaultTable;
