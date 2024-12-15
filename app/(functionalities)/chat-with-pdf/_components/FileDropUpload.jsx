"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "@/utils/s3";

const FileDropUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) {
      alert("No file selected");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload a file smaller than 10 MB.");
      return;
    }

    setIsUploading(true);
    setUploadMessage(""); // Reset any previous messages

    try {
      const data = await uploadToS3(file);
      console.log("Upload successful:", data);
      setUploadMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMessage("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false, // Accept only one file
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #cccccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
      </div>

      {isUploading && <p>Uploading...</p>}
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default FileDropUpload;
