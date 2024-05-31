import Web3 from "web3";

export async function getETHPrice() {
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/d2abd933ae1c465e83b9ec61dc3ee700"
  );
  console.log(provider);
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const web3 = new Web3(provider);
  console.log(web3);

  const aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "description",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
      name: "getRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  // The address of the contract which will provide the price of ETH
  const addr = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  // We create an instance of the contract which we can interact with
  const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
  // We get the data from the last round of the contract
  console.log(priceFeed);
  const roundData = await priceFeed.methods.latestRoundData().call()
  console.log(roundData);
  // Determine how many decimals the price feed has (10**decimals)
  const decimals = await priceFeed.methods.decimals().call();
  console.log(decimals);
  // We convert the price to a number and return it
  return Number(
    (roundData.answer.toString() / Math.pow(10, Number(decimals))).toFixed(2)
  );

}

// import { ethers } from "ethers";

// export async function getETHPrice() {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   console.log(provider);
//   // This constant describes the ABI interface of the contract, which will provide the price of ETH
//   // It looks like a lot, and it is, but this information is generated when we compile the contract
//   // We need to let ethers know how to interact with this contract.
//   const aggregatorV3InterfaceABI = [
//     {
//       inputs: [],
//       name: "decimals",
//       outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "description",
//       outputs: [{ internalType: "string", name: "", type: "string" }],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
//       name: "getRoundData",
//       outputs: [
//         { internalType: "uint80", name: "roundId", type: "uint80" },
//         { internalType: "int256", name: "answer", type: "int256" },
//         { internalType: "uint256", name: "startedAt", type: "uint256" },
//         { internalType: "uint256", name: "updatedAt", type: "uint256" },
//         { internalType: "uint80", name: "answeredInRound", type: "uint80" },
//       ],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "latestRoundData",
//       outputs: [
//         { internalType: "uint80", name: "roundId", type: "uint80" },
//         { internalType: "int256", name: "answer", type: "int256" },
//         { internalType: "uint256", name: "startedAt", type: "uint256" },
//         { internalType: "uint256", name: "updatedAt", type: "uint256" },
//         { internalType: "uint80", name: "answeredInRound", type: "uint80" },
//       ],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "version",
//       outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//       stateMutability: "view",
//       type: "function",
//     },
//   ];
//   // The address of the contract which will provide the price of ETH
//   const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
//   // We create an instance of the contract which we can interact with
//   const priceFeed = new ethers.Contract(
//     addr,
//     aggregatorV3InterfaceABI,
//     provider
//   );
//   // We get the data from the last round of the contract
//   const roundData = await priceFeed.latestRoundData();
//   await roundData.wait();
//   // Determine how many decimals the price feed has (10**decimals)
//   const decimals = await priceFeed.decimals();
//   await decimals.wait();
//   // We convert the price to a number and return it
//   return Number(
//     (roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2)
//   );
// }
