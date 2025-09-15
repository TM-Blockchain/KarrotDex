// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./pxAsset.sol";

/// @title pxAssetMinter - Mints pxAssets after Escrow proof
contract pxAssetMinter {
    address public escrow;
    mapping(address => bool) public approvedAssets;

    event AssetRegistered(address asset);
    event Minted(address asset, address to, uint256 amount);

    modifier onlyEscrow() {
        require(msg.sender == escrow, "Not escrow");
        _;
    }

    constructor(address _escrow) {
        escrow = _escrow;
    }

    function registerAsset(address asset) external {
        approvedAssets[asset] = true;
        emit AssetRegistered(asset);
    }

    function mintAsset(address asset, address to, uint256 amount) external onlyEscrow {
        require(approvedAssets[asset], "Not approved asset");
        pxAsset(asset).mint(to, amount);
        emit Minted(asset, to, amount);
    }
}
