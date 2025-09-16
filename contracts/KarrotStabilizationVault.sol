// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

/// @title Karrot Stabilization Vault (KSV) v1.0 - PulseChain Remix-ready Prototype
/// @author Sigma Mother / Mandala Matrix
/// @notice Provides automated peg defense and multi-asset staking for mxDAI on PulseChain

interface IERC20 {
    function transfer(address to, uint256 amount\1whenNotPaused nonReentrant external returns (bool);
    function transferFrom(address from, address to, uint256 amount\1whenNotPaused nonReentrant external returns (bool);
    function balanceOf(address owner) external view returns (uint256);
    function burn(uint256 amount\1whenNotPaused nonReentrant external;
    function decimals() external view returns (uint8);
}

contract KarrotStabilizationVault is Ownable, ReentrancyGuard, Pausable, AccessControl {
    address public owner;
    address public mxDai;
    address[] public approvedStablecoins;
    uint256 public minCollateralRatio = 130; // e.g. 130%, can be adjusted via governance
    uint256 public lowCollateralRatio = 120; // below this = risk, pause payouts
    bool public circuitBreaker = false;

    // Vault balances (asset => amount)
    mapping(address => uint256) public vaultBalances;

    // Events
    event Deposit(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event PegDefense(uint256 mxDaiBought, uint256 blockTimestamp);
    event RewardsIssued(address indexed user, uint256 reward, uint256 blockTimestamp);
    event CircuitBreakerActivated(uint256 timestamp);
    event ParamChange(string param, uint256 newValue);

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        owner = msg.sender;
        mxDai = _mxDai;
        approvedStablecoins = _stables;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    modifier notPaused() {
        require(!circuitBreaker, "Contract paused");
        _;
    }

    // ===== User Interactions =====
    function deposit(address asset, uint256 amount\1whenNotPaused nonReentrant external notPaused {
        require(isApprovedStablecoin(asset), "Asset not approved");
        require(IERC20(asset).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        vaultBalances[asset] += amount;
        emit Deposit(msg.sender, asset, amount);
    }

    function withdraw(address asset, uint256 amount) external whenNotPaused nonReentrant onlyOwner {
        require(vaultBalances[asset] >= amount, "Insufficient vault balance");
        require(IERC20(asset).transfer(msg.sender, amount), "Withdraw failed");
        vaultBalances[asset] -= amount;
        emit Withdraw(msg.sender, asset, amount);
    }

    // ===== Peg Defense Logic (Vault-Driven Buyback) =====
    function defendPeg(uint256 maxSpend, uint256 minBuy\1whenNotPaused nonReentrant external notPaused {
        require(vaultBalances[mxDai] >= minBuy, "Not enough mxDAI for buyback");
        require(minBuy > 0 && minBuy <= maxSpend, "Invalid buy amounts");
        IERC20(mxDai).burn(minBuy);
        vaultBalances[mxDai] -= minBuy;
        emit PegDefense(minBuy, block.timestamp);
    }

    // ===== Governance & Circuit Breaker =====
    function toggleBreaker() external whenNotPaused nonReentrant onlyOwner {
        circuitBreaker = !circuitBreaker;
        emit CircuitBreakerActivated(block.timestamp);
    }

    function setCollateralRatios(uint256 minRatio, uint256 lowRatio) external whenNotPaused nonReentrant onlyOwner {
        minCollateralRatio = minRatio;
        lowCollateralRatio = lowRatio;
        emit ParamChange("Collateral Ratios", minRatio);
    }

    // ===== Utility/Internal =====
    function isApprovedStablecoin(address asset) public view returns (bool) {
        if (asset == mxDai) return true;
        for (uint256 i = 0; i < approvedStablecoins.length; i++) {
            if (approvedStablecoins[i] == asset) return true;
        }
        return false;
    }

    // ===== Transparent State =====
    function getVaultBalance(address asset) public view returns (uint256) {
        return vaultBalances[asset];
    }

    function getApprovedStables() public view returns (address[] memory) {
        return approvedStablecoins;
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
