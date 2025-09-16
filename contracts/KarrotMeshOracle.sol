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
    struct PriceReport {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        uint256 value;
        uint256 timestamp;
    }

    address public owner;
    uint256 public quorum;
    uint256 public reportExpiry = 30 minutes;

    mapping(string => mapping(address => PriceReport)) public submittedPrices;
    mapping(string => address[]) public authorizedOracles;
    mapping(string => uint256) public latestConsensusPrice;

    event OracleAuthorized(string asset, address oracle);
    event PriceSubmitted(string asset, address oracle, uint256 value);
    event ConsensusPriceUpdated(string asset, uint256 consensusPrice);

    modifier onlyOwner() {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        require(msg.sender == owner, "Not owner");
        _;
    }

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        require(_quorum > 0, "Quorum must be > 0");
        owner = msg.sender;
        quorum = _quorum;
    }

    function setReportExpiry(uint256 expirySeconds) external whenNotPaused nonReentrant onlyOwner {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        reportExpiry = expirySeconds;
    }

    function authorizeOracle(string memory asset, address oracle) external whenNotPaused nonReentrant onlyOwner {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        require(!isAuthorized(asset, oracle), "Already authorized");
        authorizedOracles[asset].push(oracle);
        emit OracleAuthorized(asset, oracle);
    }

    function submitPrice(string calldata asset, uint256 value\1whenNotPaused nonReentrant external {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        require(isAuthorized(asset, msg.sender), "Not authorized oracle");

        submittedPrices[asset][msg.sender] = PriceReport(value, block.timestamp);
        emit PriceSubmitted(asset, msg.sender, value);

        checkAndUpdateConsensus(asset);
    }

    function getLatestPrice(string calldata asset) external view returns (uint256) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        return latestConsensusPrice[asset];
    }

    function checkAndUpdateConsensus(string memory asset) internal {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        address[] storage oracles = authorizedOracles[asset];
        uint256[] memory values = new uint256[](oracles.length);
        uint256 validReports = 0;

        for (uint256 i = 0; i < oracles.length; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            PriceReport memory report = submittedPrices[asset][oracles[i]];
            if (report.timestamp > 0 && block.timestamp - report.timestamp <= reportExpiry) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                values[validReports] = report.value;
                validReports++;
            }
        }

        if (validReports >= quorum) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            uint256 consensus = median(values, validReports);
            latestConsensusPrice[asset] = consensus;
            emit ConsensusPriceUpdated(asset, consensus);
        }
    }

    function isAuthorized(string memory asset, address oracle) public view returns (bool) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        address[] storage oracles = authorizedOracles[asset];
        for (uint256 i = 0; i < oracles.length; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            if (oracles[i] == oracle) return true;
        }
        return false;
    }

    function median(uint256[] memory a, uint256 len) internal pure returns (uint256) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        for (uint i = 0; i < len - 1; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            for (uint j = 0; j < len - i - 1; j++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                if (a[j] > a[j + 1]) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                    (a[j], a[j + 1]) = (a[j + 1], a[j]);
                }
            }
        }
        return a[len / 2];
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
