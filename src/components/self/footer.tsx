"use client";
import { AppConstants, ROUTES } from "@/constants";
import { useAppSelector } from "@/logic/redux/hooks";
import React from "react";

export default function Footer() {
  return (
    <footer className="customBgGradient text-primary py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 {AppConstants.project_name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
