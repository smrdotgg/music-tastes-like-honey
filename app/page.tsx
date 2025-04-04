import MainComp from "./x";
import { createClient } from "@/utils/supabase/server"; // Use server client

export const dynamic = "force-dynamic";

// Define the bucket name

const BUCKET_NAME = "videos"; // Make sure this bucket exists in your Supabase project


export default async function Page() {

  const supabase = await createClient();

  let videoUrl: string | undefined = undefined;


  // List files in the bucket
  const { data: filesUnsorted, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(undefined, {
      limit: 1, // Fetch only the latest (or first, depending on default sort)
      offset: 0,
      // sortBy: { column: 'created_at', order: 'desc' }, // Optional: Sort by creation time
    });
  const files = filesUnsorted?.filter(f => f.id !== "c38b6b27-823c-42a0-a553-2b7d7372925f");
  console.log(`GOT FILE - ${files?.at(0)?.id}`);

  if (listError) {
    console.error("Error listing files:", listError.message);
    // Handle error appropriately, maybe show an error message
  } else if (files && files.length > 0) {
    // Get the public URL for the first file found
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)

      .getPublicUrl(files[0].name); // Assumes public bucket access

    if (urlData) {
      videoUrl = urlData.publicUrl;

    } else {
      console.error("Could not get public URL for file:", files[0].name);
      // Handle case where public URL couldn't be generated

      // Consider using signed URLs if the bucket isn't public:
      // const { data: signedUrlData, error: signedUrlError } = await supabase.storage

      //   .from(BUCKET_NAME)
      //   .createSignedUrl(files[0].name, 60 * 60); // Expires in 1 hour
      // if (signedUrlData) videoUrl = signedUrlData.signedUrl;
    }
  }

  return <MainComp fileUrl={videoUrl} />;

}

