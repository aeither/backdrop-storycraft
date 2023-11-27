import { useState } from "react";
import { useStorageUpload } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import useTimelineStore from "~~/services/store/timelineStore";
import { ChatCompletion } from "~~/types/ai";

function removeIpfsPrefix(ipfsUrl: string) {
  // Check if the string starts with "ipfs://"
  if (ipfsUrl.startsWith("ipfs://")) {
    // Remove the "ipfs://" prefix
    return ipfsUrl.slice(7);
  }

  // If the string does not start with "ipfs://", return it unchanged
  return ipfsUrl;
}

const Home: NextPage = () => {
  const timeline = useTimelineStore(state => state.timeline);
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [uri, setUri] = useState<string>();
  const account = useAccount();

  const {
    writeAsync,
    isLoading: isMinting,
    isMining,
  } = useScaffoldContractWrite({
    contractName: "NFTContract",
    functionName: "mintTo",
    args: [account.address, uri],
    // For payable functions
    // value: parseEther("0.1"),
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { mutateAsync: upload } = useStorageUpload();

  const prepareMintNFT = async () => {
    console.log(account.address);
    // Get any data that you want to upload
    const metadata = {
      description: story,
      external_url: "https://backdrop-storycraft.vercel.app/",
      image: timeline[0] ? timeline[0].imageUrl : "https://via.placeholder.com/1024",
      name: "Crafted Story",
      attributes: [
        {
          display_type: "string",
          trait_type: "Base",
          value: "V1",
        },
        {
          display_type: "number",
          trait_type: "Level",
          value: 1,
        },
      ],
    };
    const dataToUpload = [metadata];

    // And upload the data with the upload function
    const [uri] = await upload({ data: dataToUpload });
    console.log("🚀 ~ file: narrate.tsx:63 ~ uploadData ~ uri:", uri);
    const url = removeIpfsPrefix(uri);
    setUri(uri);
  };

  const mintNFT = async () => {
    await writeAsync();
  };

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

        <div className="flex flex-row gap-4">
          <button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={async () => {
              genAudio(story);
            }}
          >
            Narrate
          </button>

          {uri ? (
            <button
              className="btn btn-accent"
              disabled={isLoading}
              onClick={async () => {
                mintNFT();
              }}
            >
              Mint Now!
            </button>
          ) : (
            <button
              className="btn btn-outline"
              disabled={isLoading}
              onClick={async () => {
                prepareMintNFT();
              }}
            >
              Prepare Mint
            </button>
          )}
        </div>

        {base64Audio ? (
          <>
            <audio controls>
              <source src={`data:audio/mp3;base64,${base64Audio}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </>
        ) : (
          <audio controls> </audio>
        )}
      </div>
    </>
  );
};

export default Home;
