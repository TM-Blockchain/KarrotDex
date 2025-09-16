// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockRouter {
    using SafeERC20 for IERC20;
    address public tokenIn;
    address public tokenOut;

    constructor(address _in, address _out) {
        tokenIn = _in; tokenOut = _out;
    }

    function swap(uint256 amountIn) external returns (uint256) {
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        // minting simulation: just transfer equal amount of tokenOut
        IERC20(tokenOut).transfer(msg.sender, amountIn);
        return amountIn;
    }
}
