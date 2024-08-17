import Image from "next/image";
import { Inter } from "next/font/google";
import freighterApi from "@stellar/freighter-api";
import { WalletData } from "@/components/molecules";

import {
  isConnected,
  getAddress,
  signAuthEntry,
  signTransaction,
} from "@stellar/freighter-api";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center  ${inter.className}`}
    >
      <nav className="flex flex-row w-full items-end justify-end h-12">
        <WalletData />
      </nav>
    </main>
  );
}
