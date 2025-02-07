import {
  useAccount,
  useConnect,
  useDisconnect,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import { useAutoConnect } from '../useAutoConnect';

export function Connect() {
  const { connect, connectors, error } = useConnect();
  const { isConnecting, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  
  const { data } = useSimulateContract({
    address: '0x0e381cd73faa421066dc5e2829a973405352168c',
    abi: [
      {
        name: 'mintnpass',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
      },
    ],
    functionName: 'mintnpass',
  });

  const { writeContract } = useWriteContract();

  useAutoConnect();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>FREE MINT TUNADA NFT MINT&PASS ON BASE</h2>
        {activeConnector ? (
          <>
            <button onClick={() => disconnect()} style={{ margin: '10px', padding: '10px 20px' }}>
              Disconnect from {activeConnector.name}
            </button>
            <button onClick={() => writeContract(data!.request)} style={{ margin: '10px', padding: '10px 20px' }}>
              Mint NFT [MINT&PASS]
            </button>
          </>
        ) : (
          connectors
            .filter((x) => x.id !== activeConnector?.id)
            .map((x) => (
              <button key={x.id} onClick={() => connect({ connector: x })} style={{ margin: '10px', padding: '10px 20px' }}>
                {x.name}
                {isConnecting && ' (connecting)'}
              </button>
            ))
        )}

        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error.message}</div>}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href = "https://opensea.io/collection/tunada-mintnpass-base" target = "_self">
          <img src="treasure-hunt.png" alt="Treasure Hunt" style={{ maxWidth: '100%', height: 'auto' }} />
        </a>
      </div>
    </div>
  );
}
