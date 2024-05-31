//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


library PriceConverter
{
    
    function getPrice() public view returns(uint256)
    {
        // to deploy another contract within this contract , we need 2 things, address and abi of that contract, both avl on chainlink documantation
        // address : 0x694AA1769357215DE4FAC081bf1f309aDC325306
        // abi : import the interface of that contract

        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (,int256 price,,,)=priceFeed.latestRoundData();
        //returns price of ETH in USD
        // number of decimal places here will be 8
        // in msg.sender(), no of DP will be 18
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount) public view returns(uint256)
    {
        uint256 ethPrice = getPrice(); // has 18 DP
        uint ethAmountInUsd = (ethPrice * ethAmount)/1e18; // as both price and amount have 18 DP , the answer would end up having 36 DP , hence divide by 18 DP
        return ethAmountInUsd ; // has 18 DP
    }

    // function getVersion() public view returns(uint256)
    // {
    //     return AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306).version();
    // }
}