import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, FileIcon, LoaderCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

import { createEventApi } from "../apis/eventsApi";
import type { CreateEventPayload } from "../types/eventsTypes";
import { handleResponse } from "../../../../utils/handleErrors";

export const CreateEventForm: React.FC = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateEventPayload>({
    title: "",
    description: "",
    topic: "",
    date: "",
    location: "",
    image: null,
  });

  const mutation = useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setFormData({
        title: "",
        description: "",
        topic: "",
        date: "",
        location: "",
        image: null,
      });
    },
    onError: (error) => handleResponse({ error }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((p) => ({ ...p, image: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, date, location } = formData;
    if (!title || !description || !date || !location) {
      toast.error("Please fill all required fields");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-3 mb-8 ">
        <Link to="/dashboard/events">
          <button className="bg-gray-900 p-2 rounded-full shadow-xl cursor-pointer">
            <ArrowLeft size={18} className="text-white" />
          </button>
        </Link>
      </div>

      {/* TOP INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { icon: "🎉", text: "Add exciting event details" },
          { icon: "📅", text: "Set the perfect date & time" },
          { icon: "📍", text: "Choose your event location" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-xl
              bg-gradient-to-r from-blue-900 to-blue-700"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20">
              {item.icon}
            </div>
            <p className="text-blue-100 text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-black dark:text-white mb-12">
        Share your amazing event with the community. Fill in the details and
        upload a banner.
      </p>

      <h2 className="text-2xl font-extrabold mb-6">Create Your Event</h2>

      <Card className="bg-white dark:bg-[#1b1b1d]">
        <form onSubmit={handleSubmit}>
          <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-14">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* TITLE */}
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="
                    w-full rounded-md px-4 py-3
                    border border-blue-900
                    bg-white text-black
                    dark:bg-black dark:text-white dark:border-zinc-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  required
                />
              </div>

              {/* DATE */}
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="
                    w-full rounded-md px-4 py-3
                    border border-blue-900
                    bg-white text-black
                    dark:bg-black dark:!text-white dark:border-zinc-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="
                    w-full rounded-md px-4 py-4
                    border border-blue-900
                    bg-white text-black
                    dark:bg-black dark:text-white dark:border-zinc-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  required
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* TOPIC */}
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Topic
                </label>
                <input
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="Enter topic"
                  className="
                    w-full rounded-md px-4 py-3
                    border border-blue-900
                    bg-white text-black
                    dark:bg-black dark:text-white dark:border-zinc-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  required
                />
              </div>

              {/* LOCATION */}
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="
                    w-full rounded-md px-4 py-3
                    border border-blue-900
                    bg-white text-black
                    dark:bg-black dark:text-white dark:border-zinc-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  required
                />
              </div>

              {/* UPLOAD */}
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Upload Banner
                </label>

                <label
                  htmlFor="image"
                  className="
                    flex flex-col items-center justify-center gap-2 py-8
                    border border-dashed border-blue-900 rounded-md
                    cursor-pointer transition
                    hover:bg-blue-50
                    dark:border-zinc-600 dark:hover:bg-zinc-900
                  "
                >
                  <FileIcon className="text-blue-600" size={28} />
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Click or drag file to upload
                  </p>
                </label>

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />

                {formData.image && (
                  <p className="text-sm mt-3 text-blue-600 font-semibold">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          {/* FOOTER */}
          <div className="p-6 border-t dark:border-zinc-700">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="
                bg-blue-950
                text-white px-12 py-5 text-lg rounded-sm
              "
            >
              {mutation.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
