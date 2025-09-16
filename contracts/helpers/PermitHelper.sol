// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Errors.sol";

library PermitHelper {
    using SafeERC20 for IERC20;

    function permitAndPull(
        IERC20 token,
        IERC20Permit permitToken,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) internal {
        permitToken.permit(owner, spender, value, deadline, v, r, s);
        token.safeTransferFrom(owner, spender, value);
    }
}
