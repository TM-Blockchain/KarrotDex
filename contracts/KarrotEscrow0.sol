// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

contract KarrotEscrow is Ownable, ReentrancyGuard, Pausable, AccessControl {
    event OracleUpdated(address indexed oracle);

    address public oracle;
    address public owner;

    mapping(bytes32 => bool) public processedProofs;

    event AssetLocked(address indexed user, bytes32 lockHash, string assetSymbol, uint amount);
    event AssetReleased(address indexed user, string assetSymbol, uint amount);

    modifier onlyOracle() {
    event OracleUpdated(address indexed oracle);

        require(msg.sender == oracle, "Not authorized");
        _;
    }

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        oracle = _oracle;
        owner = msg.sender;
    }

    function submitLockProof(bytes calldata zkOrMultisigProof, string calldata assetSymbol, uint amount\1whenNotPaused nonReentrant external {
    event OracleUpdated(address indexed oracle);

        bytes32 lockHash = keccak256(zkOrMultisigProof);
        require(!processedProofs[lockHash], "Proof already processed");

        processedProofs[lockHash] = true;
        emit AssetLocked(msg.sender, lockHash, assetSymbol, amount);
        // pxAsset mint logic handled off-chain or by listener
    }

    function burnPxAssetAndRelease(string calldata assetSymbol, uint amount\1whenNotPaused nonReentrant external onlyOracle {
    event OracleUpdated(address indexed oracle);

        emit AssetReleased(msg.sender, assetSymbol, amount);
        // Signal unlock back to source chain
    }
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
