import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { DonateButton } from "~~/components/DonateButton";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

type JsonAttributes = {
  display_type: string;
  trait_type: string;
  value: string | number;
};

type NftMetadata = {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: JsonAttributes[];
};

const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
};

const Stability: NextPage = () => {
  // get count from nextToMint
  const { data: totalSupply } = useScaffoldContractRead({
    contractName: "NFTContract",
    functionName: "totalSupply",
  });

  // convert totalSupply to number
  const totalSupplyNumber = totalSupply ? Number(totalSupply) : 0;

  // for each number from totalSupply render an Item Card
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-2">
      {Array.from({ length: totalSupplyNumber }).map((_, index) => (
        <div key={index}>
          <ItemCard index={index} />
        </div>
      ))}
    </div>
  );
};

export default Stability;

const ItemCard = ({ index }: { index: number }) => {
  const [metadata, setMetadata] = useState<NftMetadata>();

  // token uri to get metadata
  const { data: metadataUrl } = useScaffoldContractRead({
    contractName: "NFTContract",
    functionName: "tokenURI",
    args: [BigInt(index)],
  });
  // ownerOf to get owner address
  const { data: author } = useScaffoldContractRead({
    contractName: "NFTContract",
    functionName: "ownerOf",
    args: [BigInt(index)],
  });

  const getMetadata = async () => {
    if (metadataUrl && isUrl(metadataUrl)) {
      const response = await fetch(metadataUrl);
      const metadata = (await response.json()) as NftMetadata;
      console.log("metadata is url", metadata);
      setMetadata(metadata);
    }
  };
  useEffect(() => {
    getMetadata();
  }, [metadataUrl]);

  // wagmi donate to author address in author
  const json = {
    description:
      "Adipisicing sint reprehenderit amet dolor aute nisi est eiusmod laborum. Adipisicing sint reprehenderit amet dolor aute nisi est eiusmod laborum.",
    external_url: "https://backdrop-storycraft.vercel.app/",
    image: "https://utfs.io/f/a9c54e88-2791-4435-b4b1-c0f6584a0118-1nq2cb.png",
    name: "Crafted Story",
    attributes: [
      { display_type: "string", trait_type: "Base", value: "V1" },
      { display_type: "number", trait_type: "Level", value: 1 },
    ],
  };

  return (
    <div className="flex flex-row gap-4 p-8 items-center">
      <img
        className="w-56 h-auto rounded-md"
        src={metadata ? metadata.image : "https://via.placeholder.com/1024"}
        alt=""
      />
      <div className="flex flex-col ">
        <div className="max-h-28 overflow-hidden" style={{ overflow: "auto", scrollbarWidth: "none" }}>
          {metadata?.description}
        </div>

        {author && (
          <>
            <a
              href={`https://basescan.org/address/${author}`}
              rel="noreferrer"
              target="_blank"
              className="underline py-2"
            >
              <div className="font-light text-secondary">{shortenAddress(author)}</div>
            </a>
            <DonateButton toAddress={author} />
          </>
        )}
      </div>
    </div>
  );
};
