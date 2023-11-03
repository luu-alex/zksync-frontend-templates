'use client'

import { useState, useEffect } from 'react';
import { Contract } from 'zksync-web3';
import type { BigNumber } from 'ethers';

import { usdcContractConfig } from './contracts'
import { useEthereum } from './Context';

type TransferLog = {
  from: string;
  to: string;
  amount: BigNumber;
};

export function WatchContractEvents() {
  const { getProvider } = useEthereum();
  const [events, setEvents] = useState<TransferLog[]>([]);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const contract = new Contract(usdcContractConfig.address, usdcContractConfig.abi, provider);
    const handleTransfer = (from: string, to: string, amount: BigNumber) => {
      setEvents(prevEvents => [...prevEvents, { from, to, amount }]);
    };
    
    contract.on('Transfer', handleTransfer);
    
    return () => {
      contract.off('Transfer', handleTransfer);
    };
  }, []);

  const logs = events
    .slice()
    .reverse()
    .map((log) => JSON.stringify(log, null, 2))
    .join('\n\n\n\n');

  return (
    <div>
      <details>
        <summary>{events.length} USDC `Transfer`s logged</summary>
        <pre>{logs}</pre>
      </details>
    </div>
  );
}