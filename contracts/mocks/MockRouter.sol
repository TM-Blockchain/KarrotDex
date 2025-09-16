// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockRouter {
    using SafeERC20 for IERC20;

    // Simply transfers a fixed proportion (e.g., 99%) of tokenOut it holds to caller, or mints-like via pre-funded balance.
    // Encoded as: route(bytes data, address tokenIn, address tokenOut, uint256 amountIn) -> returns (uint256 amountOut)
    function route(bytes calldata /*data*/, address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256 amountOut) {
        // simulate exact tokens in -> tokens out @ 1:1 for predictability
        // pull tokenIn from caller (the aggregator)
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        // send same amount back in tokenOut to caller (aggregator)
        amountOut = amountIn;
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);
    }
}
