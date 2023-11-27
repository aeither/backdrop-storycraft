import { useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import useTimelineStore from "~~/services/store/timelineStore";
import { ChatCompletion } from "~~/types/ai";

const Home: NextPage = () => {
  const timeline = useTimelineStore(state => state.timeline);
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);

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
    setStory(data.choices[0].message.content || "Something wrong happened :(");

    setIsLoading(false);
  }

  async function genAudio(story: string) {
    console.log("Calling genAudio");
    setIsLoading(true);

    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: story }),
    });

    if (!response.ok) {
      throw new Error("Failed to call the API");
    }

    console.log("Call successful");

    const resp = await response.json();
    setBase64Audio(resp.data);

    setIsLoading(false);
  }

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 gap-4">
        <div className="w-full flex border rounded-md p-4 m-4">
          <ul className="flex overflow-x-auto space-x-4">
            {timeline.map((item, index) => (
              <li key={index} className="flex-none">
                {/* <span>{item.id}</span> */}
                <img className="w-36 h-auto rounded-md" src={item.imageUrl} alt="image" />
              </li>
            ))}
          </ul>
        </div>

        <button
          className="btn btn-primary"
          disabled={isLoading}
          onClick={async () => {
            await generateStory(timeline[0].imageUrl);
          }}
        >
          Generate Story
        </button>
        <textarea
          value={story}
          className="textarea textarea-bordered w-full max-w-lg h-96"
          onChange={e => {
            setStory(e.target.value);
          }}
        >
          {story}
        </textarea>

        <button
          className="btn btn-primary"
          disabled={isLoading}
          onClick={async () => {
            genAudio(story);
          }}
        >
          Narrate
        </button>

        {base64Audio ? (
          <audio controls>
            <source src={`data:audio/mp3;base64,${base64Audio}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <audio controls> </audio>
        )}
      </div>
    </>
  );
};

export default Home;
