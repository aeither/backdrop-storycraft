import * as React from "react";
import { EtherInput } from "./scaffold-eth";
import { useDebounce } from "use-debounce";
import { parseEther } from "viem";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";

export function DonateButton({ toAddress }: { toAddress: string }) {
  const [amount, setAmount] = React.useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    to: toAddress,
    value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <form
        className="flex flex-row gap-4 w-full p-4"
        onSubmit={e => {
          e.preventDefault();
          sendTransaction?.();
        }}
      >
        <EtherInput
          aria-label="Amount (ether)"
          onChange={amount => setAmount(amount)}
          placeholder="0.05"
          value={amount}
        />
        <button type="submit" className=" btn btn-primary" disabled={isLoading || !sendTransaction || !amount}>
          {isLoading ? "Sending..." : "Donate"}
        </button>
        {isSuccess && <div>Successfully sent {amount}</div>}
      </form>
      {/* {isSuccess ? (
        <div>
          Successfully sent {amount} ether to {toAddress}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      ) : (
        <div></div>
      )} */}
    </>
  );
}
