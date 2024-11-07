import React from "react";
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
  GetProvidersResponse,
  isBankStatusOk,
  ProviderStatus,
} from "@/logic/services/financeService";
import { SA } from "@/constants";
import { ModalCmp } from "./ModalCmp";
import UploadFileComponent from "./UploadFileCmp";
import { AlertDialogCancel, AlertDialogFooter } from "./ui/alert-dialog";

interface BanksTableProps {
  providers: GetProvidersResponse["data"];
  handleSelectBank: any;
  country: string;
}

const BanksTable: React.FC<BanksTableProps> = ({
  providers,
  handleSelectBank,
  country,
}) => {
  return (
    <Table className="w-full bg-white shadow-md rounded-lg">
      <TableHeader>
        <TableRow className="border-b">
          <TableHead>Name</TableHead>
          <TableHead>ISO Code</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
          {/* <TableHead>Status</TableHead> */}
          {/* <TableHead>Enabled</TableHead> */}
          {country == SA && <TableHead>Supported</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider) => {
          const isASupportedBank = isBankStatusOk(provider);
          const trigger = (
            <TableCell className="flex space-x-2 items-center cursor-pointer hover:underline">
              <img
                src={provider.logo}
                alt={`${provider.englishName} logo`}
                className="w-8 h-8 rounded-full"
              />
              <span>{provider.country.englishName}</span>
            </TableCell>
          );

          return (
            <TableRow key={provider.id} className="hover:bg-gray-100">
              {!isASupportedBank ? (
                <ModalCmp
                  Content={
                    <div>
                      <UploadFileComponent />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        {/* <AlertDialogAction onClick={() => onOk()}>Continue</AlertDialogAction> */}
                      </AlertDialogFooter>
                    </div>
                  }
                  trigger={trigger}
                />
              ) : (
                <TableCell
                  onClick={() => handleSelectBank(provider)}
                  className="flex space-x-2 items-center cursor-pointer hover:underline"
                >
                  <img
                    src={provider.logo}
                    alt={`${provider.englishName} logo`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{provider.country.englishName}</span>
                </TableCell>
              )}

              <TableCell>{provider.country.iso3166Code} </TableCell>
              <TableCell>
                {provider.address} - {country}
              </TableCell>
              <TableCell>{provider.phone}</TableCell>
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
              {/* <TableCell>
                          <span
                            className={
                              provider.isEnabled
                                ? "text-green-500 font-semibold"
                                : "text-red-500 font-semibold"
                            }
                          >
                            {provider.isEnabled ? "Yes" : "No"}
                          </span>
                        </TableCell> */}

              {country == SA && (
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
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BanksTable;
