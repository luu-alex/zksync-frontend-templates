import { useState, useEffect } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { formatBalance } from '@/services/utils.ts';
import { useAsync } from '@/hooks/use-async.ts';

export function Balance() {
  return (
    <>
      <div>
        <AccountBalance />
      </div>
      <br />
      <div>
        <FindBalance />
      </div>
    </>
  );
}

function AccountBalance() {
  const { getWeb3, account } = useEthereum();
  const {
    result: balance,
    execute: fetchBalance,
    error,
  } = useAsync((address) => getWeb3()!.eth.getBalance(address));

  useEffect(() => {
    if (account?.address) {
      void fetchBalance(account.address);
    }
  }, [account, fetchBalance]);

  return (
    <div>
      <div>
        Connected wallet balance: {balance !== null ? formatBalance(balance) : '-'}{' '}
        <button onClick={() => fetchBalance(account?.address)}>refetch</button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

function FindBalance() {
  const [address, setAddress] = useState('');
  const { getWeb3 } = useEthereum();

  const fetchBalanceFunc = async (address: string) => {
    const web3 = getWeb3();
    if (!web3) throw new Error('Provider not found!');

    return web3.eth.getBalance(address);
  };

  const { result: balance, execute: fetchBalance, inProgress, error } = useAsync(fetchBalanceFunc);

  return (
    <div>
      <div>
        Find balance:{' '}
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type='text'
          placeholder='wallet address'
        />{' '}
        <button onClick={() => fetchBalance(address)}>
          {inProgress ? 'fetching...' : 'fetch'}
        </button>
      </div>
      <div>{balance !== null ? formatBalance(balance) : '-'}</div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
