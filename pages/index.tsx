import Image from "next/image";
import { Inter } from "next/font/google";
import freighterApi from "@stellar/freighter-api";
import { WalletData } from "@/components/molecules";
import { Button } from "@/components/ui/button";
import { fetchPoll, fetchVoter, vote, deposit } from "../components/soroban";

import {
  isConnected,
  getAddress,
  signAuthEntry,
  signTransaction,
} from "@stellar/freighter-api";
import { Soroban } from "@stellar/stellar-sdk";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const depositFunds = async () => {
    let value = 5000;
    await deposit(value);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center  ${inter.className}`}
    >
      <nav className="fixed left-0 px-10 top-0 w-full flex flex-row h-16 items-center justify-between">
        <div className="flex flex-row items-center space-x-4">
          <img src={"/logo.png"} />
          <span> Lumen Finance </span>
        </div>
        <div className="flex flex-row items-center space-x-6">
          <span>Get Funding</span>
          <span>Invest Funds</span>

          <WalletData />
        </div>
      </nav>

      <div className="min-h-screen pt-20 flex flex-col space-y-6">
        <div className="rounded-lg bg-white h-48 p-6 flex flex-col space-y-4 shadow-sm">
          <div className="w-full flex flex-row space-x-16">
            <div className="flex flex-col space-y-2">
              <span className="flex flex-row items-center space-x-2 w-48">
                <span> Claimable Interest </span>
                <img src="/info.png" className="flex w-3 h-3" />
              </span>
              <div className="text-2xl">$0.20</div>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="flex flex-row items-center space-x-2">
                <span></span>
              </span>
              <div className="text-2xl"></div>
            </div>

            <div className="w-full flex justify-end space-x-4">
              <Button
                onClick={depositFunds}
                className="h-8 items-center flex bg-indigo-600"
              >
                Claim Funds
              </Button>
              <Button
                onClick={depositFunds}
                className="h-8 items-center flex bg-indigo-600"
              >
                Deposit
              </Button>
              <p className="instructions">{/* <Counter /> */}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row text-xs text-gray-500">
              Next Payment Due
            </div>
            <div className="flex flex-row space-x-8">
              <span> Acacia Gardening </span>
              <span> $5000 </span>
              <span> July 30, 2024 </span>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden bg-white h-72 flex flex-col space-y-4 shadow-sm">
          <img src="/loans2.png" />
        </div>

        {/* <ul role="list" className="link-card-grid">
        <Card
          href="https://docs.astro.build/"
          title="Documentation"
          body="Learn how Astro works and explore the official API docs."
        />
        <Card
          href="https://astro.build/integrations/"
          title="Integrations"
          body="Supercharge your project with new frameworks and libraries."
        />
        <Card
          href="https://astro.build/themes/"
          title="Themes"
          body="Explore a galaxy of community-built starter themes."
        />
        <Card
          href="https://astro.build/chat/"
          title="Community"
          body="Come say hi to our amazing Discord community. ❤️"
        />
      </ul> */}
      </div>
    </main>
  );
}
