import { getAllSponsors } from "@/app/actions/sponsors";
import ViewSponsorClient from "./ViewSponsorClient";

export default async function ViewSponsor() {
  const sponsors = await getAllSponsors();
  return <ViewSponsorClient sponsors={sponsors} />;
}
