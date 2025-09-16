// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

/// @title Karrot Mesh Oracle - Quorum Median Oracle for Multi-Chain Feeds
contract KarrotMeshOracle is Ownable, ReentrancyGuard, Pausable, AccessControl {

using OracleUtils for OracleUtils.Price;

// Reporter roles & quorum
bytes32 public constant REPORTER_ROLE = keccak256("REPORTER_ROLE");
uint256 public quorum = 3;
uint256 public heartbeat = 30 minutes;

struct Submission { address reporter; uint256 value; }
struct Round { uint256 id; Submission[] subs; bool finalized; uint256 median; uint256 updatedAt; }

// assetId => roundId => Round
mapping(bytes32 => mapping(uint256 => Round)) internal _rounds;
// assetId => latest finalized
mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;

event ReporterAdded(address indexed reporter);
event ReporterRemoved(address indexed reporter);
event QuorumUpdated(uint256 value);
event HeartbeatUpdated(uint256 value);
event ValueSubmitted(bytes32 indexed assetId, uint256 indexed roundId, address indexed reporter, uint256 value);
event ValueFinalized(bytes32 indexed assetId, uint256 indexed roundId, uint256 median, uint256 updatedAt);

    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
    struct Report {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        uint256 value;
        uint256 timestamp;
    }

    uint256 public quorum;
    mapping(address => bool) public reporters;
    mapping(uint256 => Report[]) public reports; // roundId => reports
    uint256 public latestValue;
    uint256 public latestRound;

    event ReporterAdded(address reporter);
    event ValueSubmitted(address reporter, uint256 roundId, uint256 value);
    event ValueFinalized(uint256 roundId, uint256 median);

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        quorum = _quorum;
    }

    modifier onlyReporter() {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        require(reporters[msg.sender], "Not authorized reporter");
        _;
    }

    function addReporter(address r\1whenNotPaused nonReentrant external {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        reporters[r] = true;
        emit ReporterAdded(r);
    }

    function submit(uint256 roundId, uint256 value\1whenNotPaused nonReentrant external onlyReporter {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        reports[roundId].push(Report(value, block.timestamp));
        emit ValueSubmitted(msg.sender, roundId, value);

        if (reports[roundId].length >= quorum) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            finalize(roundId);
        }
    }

    function finalize(uint256 roundId) internal {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
        Report[] storage r = reports[roundId];
        require(r.length >= quorum, "Not enough reports");

        uint256[] memory values = new uint256[](r.length);
        for (uint256 i = 0; i < r.length; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            values[i] = r[i].value;
        }

        // sort values
        for (uint256 i = 0; i < values.length; i++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
            for (uint256 j = i + 1; j < values.length; j++) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                if (values[j] < values[i]) {
    using OracleUtils for OracleUtils.Price;
    uint256 public heartbeat = 30 minutes;
    mapping(bytes32 => OracleUtils.Price) internal _priceByAsset;
                    uint256 temp = values[i];
                    values[i] = values[j];
                    values[j] = temp;
                }
            }
        }

        uint256 median = values[values.length / 2];
        latestValue = median;
        latestRound = roundId;

        emit ValueFinalized(roundId, median);
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
