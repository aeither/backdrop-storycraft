import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import useTimelineStore from "~~/services/store/timelineStore";
import { ChatCompletion } from "~~/types/ai";

const Home: NextPage = () => {
  const timeline = useTimelineStore(state => state.timeline);
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function generateStory(imageUrl: string) {
    console.log("Calling API");
    setIsLoading(true);

    const response = await fetch("/api/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to call the API");
    }

    console.log("Call successful");
    const data: ChatCompletion = await response.json();
    console.log("🚀 ~ file: story.tsx:28 ~ generateStory ~ data:", data);
    setStory(data.choices[0].message.content || "");

    setIsLoading(false);
    // return data.files[0].src;
    // Discover
  }

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 gap-4">
        <ul>
          {timeline.map((item, index) => (
            <li key={index}>
              <span>{item.id}</span>
              <img className="w-full max-w-lg h-auto" src={item.imageUrl} alt="image" />
            </li>
          ))}
        </ul>

        <button
          className="btn btn-primary"
          onClick={async () => {
            generateStory(timeline[0].imageUrl);
          }}
        >
          generateStory
        </button>
        <div>{story}</div>
      </div>
    </>
  );
};

export default Home;
