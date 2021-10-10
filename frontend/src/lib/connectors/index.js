import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { PortisConnector } from './portis-connector';
import { MagicConnector } from '@web3-react/magic-connector';
// import { Magic } from 'magic-sdk';

const supportChainIdList = [1, 3, 4, 5, 42, 137, 80001];

const getRpcEndpoint = (chainId) => {
  const endpoints = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan',
    137: 'polygon-mainnet',
    80001: 'polygon-mumbai',
  };

  return `https://${
    endpoints[chainId] || 'mainnet'
  }.infura.io/v3/c9d981d1a6814120a7cf4c76b7455edc`;
};

const rpcEndpointList = supportChainIdList.reduce(
  (accumulator, currentValue) => ({
    ...accumulator,
    [currentValue]: getRpcEndpoint(currentValue),
  }),
  {}
);

// reset WalletConnect connector
export const resetWalletConnectConnector = (connector) => {
  if (
    connector &&
    connector instanceof WalletConnectConnector &&
    connector.walletConnectProvider?.wc?.uri
  ) {
    connector.walletConnectProvider = undefined;
  }
};

export const injected = new InjectedConnector({
  supportedChainIds: supportChainIdList,
});

export const portis = new PortisConnector({
  dAppId: '68b06260-223e-4d08-bd13-d6b654b8e5bd',
  networks: supportChainIdList,
});

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/magic.md
export const magic = new MagicConnector({
  apiKey: "pk_live_1C92C25B986D7BFF",
  chainId: 4,
  email: "julien@strat.cc",
});

export const walletconnect = new WalletConnectConnector({
  rpc: rpcEndpointList,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

export const walletlink = new WalletLinkConnector({
  url: getRpcEndpoint(1),
  appName: 'Create React Ethereum DApp',
  supportedChainIds: [1],
});

export const connectorList = {
  MetaMask: injected,
  Portis: portis,
  WalletConnect: walletconnect,
  WalletLink: walletlink,
};

export default connectorList;
