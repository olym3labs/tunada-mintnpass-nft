import { useState, useEffect, ChangeEvent } from 'react';
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useSimulateContract,
} from 'wagmi';
import { parseEther } from 'viem';
import { TokenSelector } from './TokenSelector';
import { CONTRACT_ADDRESS, ABI } from '../utils/constants';

interface UserInfo {
  amount: bigint;
}

export const StakingComponent = () => {
  const [stakeAmount, setStakeAmount] = useState<string>('0');
  const [selectedToken, setSelectedToken] = useState<string>('0x6B4903306CF5158842FA5C2acE8826b803E4c601'); // TUNADA Default token address
  const { address } = useAccount();

  const { data: userInfo, refetch: refetchUserInfo } = useReadContract<UserInfo>({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'userInfo',
    args: [selectedToken, address],
    enabled: !!address,
  });

  const { config: depositConfig } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'deposit',
    args: [selectedToken, parseEther(stakeAmount || '0')],
    enabled: !!address && !!stakeAmount,
  });

  const { write: deposit, isLoading: isDepositing, error: depositError } = useWriteContract(depositConfig);

  useEffect(() => {
    if (address) {
      refetchUserInfo();
    }
  }, [address, selectedToken, refetchUserInfo]);

  const handleStakeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStakeAmount(e.target.value);
  };

  if (!address) return <p>Please connect your wallet.</p>;

  return (
    <div>
      <TokenSelector onSelectChange={setSelectedToken} />
      <input
        type="number"
        value={stakeAmount}
        onChange={handleStakeChange}
        placeholder="Amount to stake"
        min="0"
      />
      <button onClick={() => deposit?.()} disabled={!deposit || isDepositing || !stakeAmount}>
        {isDepositing ? 'Staking...' : 'Stake'}
      </button>

      {depositError && <p style={{ color: 'red' }}>Error: {depositError.message}</p>}

      <p>Staked: {userInfo?.amount ? userInfo.amount.toString() : '0'} tokens</p>
    </div>
  );
};
