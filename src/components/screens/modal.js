"use client";
import React from "react";

export default function Modal({ isOpen, onClose, iframeUrl }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-5xl p-4 relative" // Increased max width here
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          Close
        </button>
        <iframe
          src={iframeUrl}
          className="w-full h-[700px]" // Increased height here
          frameBorder="0"
          title="Authorization"
        ></iframe>
      </div>
    </div>
  );
}
