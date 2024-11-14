"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useAppSelector } from "@/logic/redux/hooks";
import { selectOrbiUser } from "@/logic/redux/reducers/auth";

function page() {
  const tableData = [
    {
      clientname: "A M S Y GENERAL TRADING LLC",
      date_added: "2024-10-07T13:46:12.650000",
    },
    {
      clientname: "GLEO INTERNATIONAL GENERAL TRADING LLC",
      date_added: "2024-10-08T10:05:56.133000",
    },
  ];

  const orbiUser = useAppSelector(selectOrbiUser);

  const [data, setdata] = useState<typeof tableData>([]);

  useEffect(() => {
    const asyncFunc = async () => {
      if (!orbiUser) return;

      try {
        const url = `https://api.orbii.ai/clients?user=${orbiUser?.username}&password=${orbiUser?.password}`;
        const response = await axios.get(url);

        console.log(response);

        setdata(response.data);
      } catch (error) {
        console.log("error fetching data");
        console.log(error);
      }
    };

    asyncFunc();
  }, []);

  return (
    <div className=" min-h-[90vh]">
      {data.length > 0 && (
        <Table className="w-full bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead>Client name</TableHead>
              <TableHead>Date added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.clientname}>
                <TableCell className="font-medium">
                  {invoice.clientname}
                </TableCell>

                <TableCell className="font-medium">
                  {moment(invoice.date_added).format("MMM Do YY")}
                </TableCell>
              </TableRow>
            ))}

            {/* {tableData.map((provider, index) => {
            const theRow = (
              <TableRow
                key={index}
                className="hover:bg-gray-100 cursor-pointer "
              >
                <TableCell className="flex space-x-2 items-center ">
                  <span>{provider.clientname}</span>
                </TableCell>

                <TableCell className="flex space-x-2 items-center ">
                  <span>{provider.date_added}</span>
                </TableCell>
              </TableRow>
            );

            return theRow;
          })} */}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default page;
