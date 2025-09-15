// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IEscrow {
    function usedProofs(bytes32 hash) external view returns (bool);
}

contract pxAsset is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

contract pxAssetMinter is Ownable {
    address public escrow;
    mapping(string => address) public pxAssetRegistry; // symbol => pxAsset address
    mapping(bytes32 => bool) public usedProofs;

    event pxAssetCreated(string symbol, address asset);
    event pxAssetMinted(string symbol, address to, uint256 amount);

    constructor(address _escrow) {
        escrow = _escrow;
    }

    function registerPxAsset(string calldata symbol, string calldata name) external onlyOwner {
        require(pxAssetRegistry[symbol] == address(0), "Already registered");
        pxAsset token = new pxAsset(name, symbol);
        pxAssetRegistry[symbol] = address(token);
        emit pxAssetCreated(symbol, address(token));
    }

    function mintFromLockProof(
        string calldata symbol,
        address to,
        uint256 amount,
        bytes calldata lockProof
    ) external onlyOwner {
        bytes32 proofHash = keccak256(lockProof);
        require(!usedProofs[proofHash], "Proof reused");
        require(pxAssetRegistry[symbol] != address(0), "Unregistered pxAsset");

        // Optional: check with Escrow to ensure proof used
        require(IEscrow(escrow).usedProofs(proofHash), "Proof not accepted in escrow");

        usedProofs[proofHash] = true;

        pxAsset(pxAssetRegistry[symbol]).mint(to, amount);
        emit pxAssetMinted(symbol, to, amount);
    }

    function burnPxAsset(string calldata symbol, address from, uint256 amount) external onlyOwner {
        require(pxAssetRegistry[symbol] != address(0), "Unregistered pxAsset");
        pxAsset(pxAssetRegistry[symbol]).burn(from, amount);
    }

    function updateEscrow(address newEscrow) external onlyOwner {
        escrow = newEscrow;
    }
}
