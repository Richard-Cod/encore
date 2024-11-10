"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "./ui/progress";

export default function UploadFileComponent({
  directoryName,
  containerName,
}: {
  directoryName: string;
  containerName: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      uploadFileToBackend(uploadedFile);
    } else {
      alert("Please upload a PDF file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const uploadFileToBackend = async (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();

    console.log("the file ", file);
    formData.append("file", file);
    formData.append("directoryName", directoryName);
    formData.append("containerName", containerName);

    try {
      const response = await fetch("/api/finance/upload-pdfs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      // Si la réponse est réussie, mettre à jour le statut d'upload
      const data = await response.json();
      console.log("File uploaded successfully:", data);

      setUploadStatus("success");
      setUploadProgress(100); // Compléter la progression
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Bank Statements
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
              Please drag and drop your bank statements in PDF format.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              We support: Original documents only (no scanned copies). Official
              bank statements rather than transaction exports.
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
