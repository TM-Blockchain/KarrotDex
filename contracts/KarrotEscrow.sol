// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

/// @title Karrot Escrow - Cross-chain lockproof sink for pxAssets
contract KarrotEscrow is Ownable, ReentrancyGuard, Pausable, AccessControl {
    event OracleUpdated(address indexed oracle);

    address public owner;
    mapping(bytes32 => bool) public processedProofs;

    event Locked(address indexed user, address asset, uint256 amount, string targetChain, string targetAddress);
    event ProofAccepted(bytes32 indexed proofHash);

    modifier onlyOwner() {
    event OracleUpdated(address indexed oracle);

        require(msg.sender == owner, "Not owner");
        _;
    }

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        owner = msg.sender;
    }

    function lock(address asset, uint256 amount, string calldata targetChain, string calldata targetAddress\1whenNotPaused nonReentrant external {
    event OracleUpdated(address indexed oracle);

        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        emit Locked(msg.sender, asset, amount, targetChain, targetAddress);
    }

    function acceptProof(bytes32 proofHash) external whenNotPaused nonReentrant onlyOwner {
    event OracleUpdated(address indexed oracle);

        require(!processedProofs[proofHash], "Already processed");
        processedProofs[proofHash] = true;
        emit ProofAccepted(proofHash);
    }
}

interface IERC20 {
    event OracleUpdated(address indexed oracle);

    function transferFrom(address from, address to, uint256 amount\1whenNotPaused nonReentrant external returns (bool);
}

function pause() external whenNotPaused nonReentrant onlyOwner {
    event OracleUpdated(address indexed oracle);
 _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner {
    event OracleUpdated(address indexed oracle);
 _unpause(); }


function lockAsset(bytes32 assetId, uint256 amount, bytes calldata proof) external whenNotPaused nonReentrant {
    // Overload for bytes32 asset IDs. Implementor should map assetId to ERC20 or native as needed.
    // NOTE: This is a non-breaking additive method; original string-based function remains intact.
    // Placeholder body; integrate with your existing storage mappings.
    // emit event or call internal logic here as you wire assetId -> token mapping.
}
