"use client";
import { deleteLecture } from "@/app/actions/lecture";
import BaseCard from "../base_card";

type Lecture = {
  id?: string;
  date: string;
  desc: string;
  facebook?: string;
  imageUrl?: string;
  insta?: string;
  linkedin?: string;
  link?: string;
  name: string;
  time: string;
};

export default function ViewGuestLecturesClient({
  lectures,
}: {
  lectures: Lecture[];
}) {
  const handleDelete = async (id: string) => {
    if (!id) {
      throw new Error("Unable to delete");
    }
    await deleteLecture(id);
  };
  return (
    <>
      <div className="flex flex-wrap gap-5">
        {lectures.map((lecture, i) => {
          const dataArray: { label: string; value: string; isUrl?: boolean }[] =
            [];
          dataArray.push({ label: "date", value: lecture.date });
          dataArray.push({ label: "desc", value: lecture.desc });
          dataArray.push({
            label: "facebook",
            value: lecture.facebook as string,
            isUrl: true,
          });
          dataArray.push({
            label: "linkedin",
            value: lecture.linkedin as string,
            isUrl: true,
          });
          dataArray.push({
            label: "insta",
            value: lecture.insta as string,
            isUrl: true,
          });
          dataArray.push({
            label: "link",
            value: lecture.link as string,
            isUrl: true,
          });
          dataArray.push({ label: "time", value: lecture.time });

          return (
            <BaseCard
              title={lecture.name}
              image={lecture.imageUrl as string}
              data={dataArray}
              toEdit={`guest-lectures/${lecture.id}`}
              onDelete={() => handleDelete(lecture.id as string)}
              key={i}
            />
          );
        })}
      </div>
    </>
  );
}
