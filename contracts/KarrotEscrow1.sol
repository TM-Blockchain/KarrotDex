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

    address public oracle; // To approve minting
    address public owner;

    mapping(bytes32 => bool) public usedProofs;

    event AssetLocked(address indexed user, string assetSymbol, uint256 amount, bytes32 proofHash);
    event AssetBurned(address indexed user, string assetSymbol, uint256 amount);

    modifier onlyOracle() {
    event OracleUpdated(address indexed oracle);

        require(msg.sender == oracle, "Not oracle");
        _;
    }

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        oracle = _oracle;
        owner = msg.sender;
    }

    function lockAsset(string calldata assetSymbol, uint256 amount, bytes calldata lockProof\1whenNotPaused nonReentrant external {
    event OracleUpdated(address indexed oracle);

        bytes32 proofHash = keccak256(lockProof);
        require(!usedProofs[proofHash], "Proof already used");

        usedProofs[proofHash] = true;
        emit AssetLocked(msg.sender, assetSymbol, amount, proofHash);
        // Off-chain process listens, mints pxAsset
    }

    function burnWrappedAsset(string calldata assetSymbol, uint256 amount\1whenNotPaused nonReentrant external {
    event OracleUpdated(address indexed oracle);

        emit AssetBurned(msg.sender, assetSymbol, amount);
        // Off-chain listener or bridge initiates unlock
    }

    function updateOracle(address _oracle\1whenNotPaused nonReentrant external {
    event OracleUpdated(address indexed oracle);

        require(msg.sender == owner, "Not owner");
        oracle = _oracle;
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
