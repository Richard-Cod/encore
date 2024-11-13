"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppConstants } from "@/constants";

export default function Navbar() {
  return (
    // <nav className="bg-primary text-primary-foreground fixed w-full z-40">
    <nav className="customBgGradient text-primary-foreground ">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center cursor-pointer">
        <img className=" h-12" src="/app-logo-dark.png" alt="" />
        {/* <p
          onClick={() => {
            window.location.reload();
          }}
          className="text-2xl font-bold"
        >
          {AppConstants.project_name}
        </p> */}
        {/* <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/reports">Reports</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </div> */}
      </div>
    </nav>
  );
}
