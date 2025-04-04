"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, ChangeEvent } from "react";

import { createClient } from "@/utils/supabase/client"; // Use client client

// Define the bucket name (must match the one in page.tsx)
const BUCKET_NAME = "videos";

export default function MainComp({ fileUrl }: { fileUrl?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (file) {
      // Basic validation (optional)
      if (file.size > 1 * 1024 * 1024 * 1024) {
        // 1GB limit example
        setError("File size exceeds 1GB limit.");
        return;
      }
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file.");
        return;

      }
      setSelectedFile(file);
      setError(null); // Clear previous errors
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a file first.");

      return;

    }

    setUploading(true);
    setError(null);

    try {
      // Use a unique file name, e.g., timestamp + original name or UUID
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `${fileName}`; // Store directly in the bucket root


      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, selectedFile, {
          cacheControl: "3600", // Optional: Cache control header
          upsert: false, // Optional: Don't overwrite existing files with the same name

        });


      if (uploadError) {
        throw uploadError;

      }

      // Upload successful, refresh the page to show the video

      router.refresh();
      // Optionally clear the selected file state
      // setSelectedFile(null);
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(`Upload Failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }, [selectedFile, supabase, router]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {

      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {

    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Reuse validation and state update logic
      if (file.size > 1 * 1024 * 1024 * 1024) {
        setError("File size exceeds 1GB limit.");
        return;
      }
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file.");
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  return (

    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-[var(--background)] to-[var(--secondary-green)] text-[var(--foreground)]">
      <div className="text-center space-y-6 max-w-lg p-10 bg-white/80 dark:bg-black/60 rounded-xl shadow-lg backdrop-blur-sm">
        {fileUrl ? (
          // Video Player View
          <>
            <h1 className="text-4xl font-bold text-[var(--primary-green)]">
              Your Performance! 💖
            </h1>
            <p className="text-lg">
              So excited to listen to this! Playing it now...
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-[var(--primary-green)]">
              <video controls src={fileUrl} className="w-full h-full">

                Your browser does not support the video tag.

              </video>
            </div>
          </>
        ) : (
          // Upload View
          <>
            <h1 className="text-4xl font-bold text-[var(--primary-green)]">
              Can't Wait to Hear You Play! 🎸

            </h1>
            <p className="text-lg">
              Ready for the beautiful music you're about to share. Please
              upload your guitar video below.
            </p>
            <div

              className={`border-2 border-dashed border-[var(--primary-green)] rounded-lg p-6 bg-white/50 dark:bg-black/30 transition-colors ${dragActive ? "border-solid bg-green-100/70" : ""
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"

              >
                <svg
                  className="w-12 h-12 text-[var(--primary-green)] mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>

                <span className="text-sm text-[var(--foreground)]">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : "Drag & drop or click to upload"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Video files up to 1GB
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="video/*" // Accept only video files
                onChange={handleFileChange}
                className="hidden" // Hide the default input
                disabled={uploading}
              />
            </div>

            {selectedFile && !uploading && (

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 px-6 py-2 bg-[var(--primary-green)] text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Video
              </button>
            )}


            {uploading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-[var(--foreground)]">
                  Uploading...
                </p>
                {/* Basic spinner */}
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[var(--primary-green)] mt-2"></div>
              </div>

            )}

            {error && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                Error: {error}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

