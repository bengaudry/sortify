import { PlaylistDetailsPage } from "@/views/playlistdetails";

export default function PlaylistDetails({
  params,
}: {
  params: { listid: string };
}) {
  return <PlaylistDetailsPage listid={params.listid} />;
}
