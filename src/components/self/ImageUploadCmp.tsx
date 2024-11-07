import React from "react";

function ImageUploadCmp({
  handleImageChange,
  label,
}: {
  handleImageChange: any;
  label?: string;
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        {label || "Images"}
      </label>
      <div className="mt-1 flex items-center">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md"
        >
          <svg
            className="h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 12h12v12m0 0H28m12 0L22 6l-4 4-8-8"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[10px] font-medium text-gray-600">
            Choisir un fichier
          </span>
          <input
            id="file-upload"
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
}

export default ImageUploadCmp;
