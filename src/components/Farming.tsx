// Import các hook từ wagmi
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEstimateGas,
    useSendTransaction,
    useSimulateContract,
    useWriteContract,
  } from 'wagmi';
  
  import { useEffect, useState, ChangeEvent } from 'react';
  import { Row, Col } from 'reactstrap';
  import { ethers, BigNumber } from 'ethers';
  import logo from '../assets/images/ok_farming.png';
  import ADDRESSES from '../utils/constants/ADDRESSES.json';
  import { StyledButton, StyledWrapper, ToggleButtons } from './StyledComponent';
  import ConnectWallet from './blocknative/ConnectWallet';
  import { getO3EContract, getStakingContract, getO3EBalance } from './ConnectContract';
  import ErroModal from './ErroModal';
  import Loading from './Loading';
  import CAlert from './CAlert';
  
  interface StakingInfo {
    totalStaked: string;
    canWithdraw: string;
    totalClaimed: string;
    pendingReward: string;
    apy: string;
  }
  
  const Farming = () => {
    const { address, isConnected } = useAccount();
    const [stakeAmount, setStakeAmount] = useState<number>(0);
    const [stakingInfo, setStakingInfo] = useState<StakingInfo>({
      totalStaked: '0',
      canWithdraw: '0',
      totalClaimed: '0',
      pendingReward: '0',
      apy: '0',
    });
  
    useEffect(() => {
      if (isConnected && address) {
        getValueByPlan(address);
      }
    }, [isConnected, address]);
  
    const getValueByPlan = async (walletAddress: string) => {
      const stakingContract = getStakingContract();
      const plan = await stakingContract.plans(0); // Ví dụ gọi kế hoạch đầu tiên
      const totalStaked = ethers.utils.formatUnits(await stakingContract.totalStaked(walletAddress));
  
      setStakingInfo({
        totalStaked,
        canWithdraw: '0',
        totalClaimed: '0',
        pendingReward: '0',
        apy: plan.apr.toString(),
      });
    };
  
    const handleStake = async () => {
      const stakingContract = getStakingContract();
      const amount = ethers.utils.parseEther(stakeAmount.toString());
      await stakingContract.stake(0, amount);
      getValueByPlan(address!);
    };
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setStakeAmount(Number(e.target.value));
    };
  
    return (
      <StyledWrapper>
        <img src={logo} alt="logo" style={{ height: 40 }} />
        <div>
          <h4>Farm for 30 Days</h4>
          <p>Total Farmed: {stakingInfo.totalStaked}</p>
          <input type="number" value={stakeAmount} onChange={handleChange} />
          <StyledButton onClick={handleStake}>Stake</StyledButton>
        </div>
      </StyledWrapper>
    );
  };
  
  export default Farming;
  