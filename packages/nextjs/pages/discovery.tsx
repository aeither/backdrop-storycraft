import type { NextPage } from "next";

const Stability: NextPage = () => {
  // const {
  //   data: events,
  //   isLoading: isLoadingEvents,
  //   error: errorReadingEvents,
  // } = useScaffoldEventHistory({
  //   contractName: "YourContract",
  //   eventName: "ReputationAdded",
  //   // Specify the starting block number from which to read events, this is a bigint.
  //   fromBlock: 31231n,
  //   // If set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
  //   // watch: true,
  //   // Apply filters to the event based on parameter names and values { [parameterName]: value },
  //   // filters: { premium: true },
  //   // If set to true it will return the block data for each event (default: false)
  //   blockData: true,
  //   // If set to true it will return the transaction data for each event (default: false),
  //   transactionData: true,
  //   // If set to true it will return the receipt data for each event (default: false),
  //   receiptData: true,
  // });

  return <div className="flex flex-col justify-center items-center gap-4 p-2">Hello World</div>;
};

export default Stability;
