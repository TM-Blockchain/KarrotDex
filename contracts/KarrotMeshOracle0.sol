// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

contract KarrotMeshOracle is Ownable, ReentrancyGuard, Pausable, AccessControl {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
    address public owner;
    uint public quorum; // Minimum number of agreeing feeds

    struct PriceReport {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        uint price;
        uint timestamp;
    }

    mapping(string => PriceReport[]) public assetReports;

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        owner = msg.sender;
        quorum = _quorum;
    }

    function submitPrice(string calldata asset, uint price\1whenNotPaused nonReentrant external {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        assetReports[asset].push(PriceReport(price, block.timestamp));
    }

    function getVerifiedPrice(string calldata asset) public view returns (uint) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        PriceReport[] memory reports = assetReports[asset];
        require(reports.length >= quorum, "Not enough data");

        uint[] memory prices = new uint[](reports.length);
        for (uint i = 0; i < reports.length; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            prices[i] = reports[i].price;
        }

        // Sort + take median
        for (uint i = 0; i < prices.length; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            for (uint j = i+1; j < prices.length; j++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                if (prices[i] > prices[j]) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                    (prices[i], prices[j]) = (prices[j], prices[i]);
                }
            }
        }
        return prices[reports.length / 2]; // Median
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset; _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset; _unpause(); }


function setHeartbeat(uint256 seconds_) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(seconds_ > 0, "invalid heartbeat");
    heartbeat = seconds_;
}

function getPrice(bytes32 assetId) public view returns (uint256 value, uint256 updatedAt) {
    OracleUtils.Price memory p = _priceByAsset[assetId];
    if (p.isStale(heartbeat)) revert Errors.StaleData();
    return (p.value, p.updatedAt);
}
