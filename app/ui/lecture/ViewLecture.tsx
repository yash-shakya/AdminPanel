import { getAllLecture } from "@/app/actions/lecture";
import ViewGuestLecturesClient from "./ViewLectureClient";

export default async function ViewGuestLectures() {
  const lectures = await getAllLecture();
  return <ViewGuestLecturesClient lectures={lectures} />;
}
