import MainComp from "./x";
import { UTApi } from "uploadthing/server";

export const dynamic = "force-dynamic";
const utapi = new UTApi();
export default async function Page() {
  const files = await utapi.listFiles().then(({ files }) => {
    if (files.at(0)) {
      return utapi.getSignedURL(files.at(0)!.key)
    }
  });
  return <MainComp fileUrl={files?.url} />
}
