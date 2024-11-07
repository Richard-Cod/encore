"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "./ui/progress";

export default function UploadFileComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      simulateUpload();
    } else {
      alert("Please upload a PDF file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const simulateUpload = () => {
    setUploadStatus("uploading");
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Bank Transactions
      </h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {uploadStatus === "idle" && (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your PDF file here, or click to select a file
            </p>
          </>
        )}
        {uploadStatus === "uploading" && (
          <>
            <File className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-2 text-sm text-gray-600">
              Uploading: {file?.name}
            </p>
            <Progress value={uploadProgress} className="mt-2" />
          </>
        )}
        {uploadStatus === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-2 text-sm text-green-600">
              Upload successful: {file?.name}
            </p>
          </>
        )}
        {uploadStatus === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-2 text-sm text-red-600">
              Upload failed. Please try again.
            </p>
          </>
        )}
      </div>
      {uploadStatus === "success" && (
        <Button onClick={resetUpload} className="mt-4 w-full">
          Upload Another File
        </Button>
      )}
      {uploadStatus === "error" && (
        <Button onClick={resetUpload} className="mt-4 w-full">
          Try Again
        </Button>
      )}
    </div>
  );
}
