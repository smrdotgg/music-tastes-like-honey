"use client";

import { useRouter } from "next/navigation";
import { UploadDropzone } from "./uploadthing"; // Use Dropzone for better UX

export default function MainComp({ fileUrl }: { fileUrl?: string }) {
  const router = useRouter();

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
            <div className="border-2 border-dashed border-[var(--primary-green)] rounded-lg p-6 bg-white/50 dark:bg-black/30">

              <UploadDropzone
                endpoint="videoUploader"

                onClientUploadComplete={(res) => {
                  // Refresh the page to potentially show the video player
                  router.refresh();
                }}
                onUploadError={(error: Error) => {

                  alert(`Upload Error: ${error.message}`);
                }}
                config={{ mode: "auto" }}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

