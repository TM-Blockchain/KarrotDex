// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IEscrow {
    function usedProofs(bytes32 hash) external view returns (bool);
}

contract pxAsset is ERC20, Ownable, ReentrancyGuard, Pausable, AccessControl {
    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);}

    function mint(address to, uint256 amount) external whenNotPaused nonReentrant onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external whenNotPaused nonReentrant onlyOwner {
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

    function registerPxAsset(string calldata symbol, string calldata name) external whenNotPaused nonReentrant onlyOwner {
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
    ) external whenNotPaused nonReentrant onlyOwner {
        bytes32 proofHash = keccak256(lockProof);
        require(!usedProofs[proofHash], "Proof reused");
        require(pxAssetRegistry[symbol] != address(0), "Unregistered pxAsset");

        // Optional: check with Escrow to ensure proof used
        require(IEscrow(escrow).usedProofs(proofHash), "Proof not accepted in escrow");

        usedProofs[proofHash] = true;

        pxAsset(pxAssetRegistry[symbol]).mint(to, amount);
        emit pxAssetMinted(symbol, to, amount);
    }

    function burnPxAsset(string calldata symbol, address from, uint256 amount) external whenNotPaused nonReentrant onlyOwner {
        require(pxAssetRegistry[symbol] != address(0), "Unregistered pxAsset");
        pxAsset(pxAssetRegistry[symbol]).burn(from, amount);
    }

    function updateEscrow(address newEscrow) external whenNotPaused nonReentrant onlyOwner {
        escrow = newEscrow;
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
