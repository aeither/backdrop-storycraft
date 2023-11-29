import type { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Stability: NextPage = () => {
  // get count from nextToMint
  const { data: totalCounter } = useScaffoldContractRead({
    contractName: "NFTContract",
    functionName: "totalSupply",
  });

  // for each number from totalSupply render an Item Card
  return <div className="flex flex-col justify-center items-center gap-4 p-2">Hello World</div>;
};

export default Stability;

const ItemCard: React.FC = () => {
  // token uri to get metadata
  const { data: metadata } = useScaffoldContractRead({
    contractName: "NFTContract",
    functionName: "tokenURI",
    args: [BigInt(1)],
  });
  // ownerOf to get owner address
  const { data: author } = useScaffoldContractRead({
    contractName: "NFTContract",
    functionName: "ownerOf",
    args: [BigInt(1)],
  });

  // wagmi donate to author address in author

  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};
