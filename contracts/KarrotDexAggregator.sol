// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

/// @title Karrot DEX Aggregator — Modular Routing (V2 DEX | V3 | Thor | ZK | xStocks Ray | xStocks Jup)
/// @notice Adapter-based router with off-chain quoting and relayer bridges for Solana xStocks
/// @dev On-chain enforces slippage (minOut), settlement via relayers

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function approve(address spender, uint256 value\1whenNotPaused nonReentrant external returns (bool);
    function transferFrom(address, address, uint256\1whenNotPaused nonReentrant external returns (bool);
    function transfer(address to, uint256 value\1whenNotPaused nonReentrant external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    \1whenNotPaused nonReentrant external returns (uint[] memory amounts);
}

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params\1whenNotPaused nonReentrant external payable returns (uint256 amountOut);
}

abstract contract Ownable is Ownable, ReentrancyGuard, Pausable, AccessControl {
    address public owner;
    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }
    event OwnershipTransferred(address indexed from, address indexed to);
    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    function transferOwnership(address newOwner) external whenNotPaused nonReentrant onlyOwner {
        require(newOwner != address(0), "zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract KarrotDexAggregator is Ownable {
    /*---------- Router Structs ----------*/
    struct V2Router { string name; IUniswapV2Router02 router; bool active; }
    struct V3Router { string name; IUniswapV3Router router; bool active; }

    mapping(bytes32 => V2Router) public v2Routers;
    mapping(bytes32 => V3Router) public v3Routers;

    /*---------- Relayer Addresses ----------*/
    address public thorRelayer;
    address public zkRelayer;
    address public xStocksRayRelayer;
    address public xStocksJupRelayer;

    mapping(bytes32 => bool) public thorSettled;
    mapping(bytes32 => bool) public zkSettled;
    mapping(bytes32 => bool) public xStocksRaySettled;
    mapping(bytes32 => bool) public xStocksJupSettled;

    /*---------- Events ----------*/
    event RouterSet(string venue, address router, bool isV3, bool active);
    event V2Swap(string indexed venue, address user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event V3Swap(string indexed venue, address user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event ThorRequested(bytes32 requestId, address user, address tokenIn, uint256 amountIn, string chain, string memo);
    event ThorSettled(bytes32 requestId, address to, address tokenOut, uint256 amountOut);
    event ZKSwapRequested(bytes32 requestId, address user, address tokenIn, uint256 amountIn, string memo);
    event ZKSwapSettled(bytes32 requestId, address to, address tokenOut, uint256 amountOut);
    event XStocksRayRequested(bytes32 requestId, address user, address tokenIn, uint256 amountIn);
    event XStocksRaySettled(bytes32 requestId, address to, uint256 amountOut);
    event XStocksJupRequested(bytes32 requestId, address user, address tokenIn, uint256 amountIn);
    event XStocksJupSettled(bytes32 requestId, address to, uint256 amountOut);

    /*---------- Admin ----------*/
    function setV2Router(string calldata name, address router, bool active) external whenNotPaused nonReentrant onlyOwner {
        v2Routers[keccak256(bytes(name))] = V2Router(name, IUniswapV2Router02(router), active);
        emit RouterSet(name, router, false, active);
    }

    function setV3Router(string calldata name, address router, bool active) external whenNotPaused nonReentrant onlyOwner {
        v3Routers[keccak256(bytes(name))] = V3Router(name, IUniswapV3Router(router), active);
        emit RouterSet(name, router, true, active);
    }

    function setThorRelayer(address r) external whenNotPaused nonReentrant onlyOwner { thorRelayer = r; }
    function setZKRelayer(address r) external whenNotPaused nonReentrant onlyOwner { zkRelayer = r; }
    function setXStocksRayRelayer(address r) external whenNotPaused nonReentrant onlyOwner { xStocksRayRelayer = r; }
    function setXStocksJupRelayer(address r) external whenNotPaused nonReentrant onlyOwner { xStocksJupRelayer = r; }

    /*---------- Internal Helpers ----------*/
    function _pull(IERC20 t, address from, uint256 amt) internal {
        require(t.transferFrom(from, address(this), amt), "pull fail");
    }

    function _approveMax(IERC20 t, address router) internal {
        if (t.allowance(address(this), router) == 0) {
            t.approve(router, type(uint256).max);
        }
    }

    /*---------- Swap Functions ----------*/
    function swapV2(
        string calldata venue,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minOut,
        address[] calldata path,
        uint256 deadline
    \1whenNotPaused nonReentrant external returns (uint256 amountOut) {
        V2Router memory r = v2Routers[keccak256(bytes(venue))];
        require(r.active, "inactive V2");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        _approveMax(IERC20(tokenIn), address(r.router));
        uint[] memory out = r.router.swapExactTokensForTokens(amountIn, minOut, path, msg.sender, deadline);
        amountOut = out[out.length - 1];
        emit V2Swap(venue, msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function swapV3(
        string calldata venue,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minOut,
        uint24 fee,
        uint256 deadline
    \1whenNotPaused nonReentrant external returns (uint256 amountOut) {
        V3Router memory r = v3Routers[keccak256(bytes(venue))];
        require(r.active, "inactive V3");
        _pull(IERC20(tokenIn), msg.sender, amountIn);
        _approveMax(IERC20(tokenIn), address(r.router));
        IUniswapV3Router.ExactInputSingleParams memory p = IUniswapV3Router.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: msg.sender,
            deadline: deadline,
            amountIn: amountIn,
            amountOutMinimum: minOut,
            sqrtPriceLimitX96: 0
        });
        amountOut = r.router.exactInputSingle(p);
        emit V3Swap(venue, msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    /*---------- Thor Relayer ----------*/
    function requestThorSwap(
        address tokenIn,
        uint256 amountIn,
        string calldata chain,
        string calldata memo
    \1whenNotPaused nonReentrant external returns (bytes32 requestId) {
        _pull(IERC20(tokenIn), msg.sender, amountIn);
        requestId = keccak256(abi.encode(msg.sender, tokenIn, amountIn, chain, memo, block.number));
        emit ThorRequested(requestId, msg.sender, tokenIn, amountIn, chain, memo);
    }

    function settleThorSwap(
        bytes32 requestId,
        address to,
        address tokenOut,
        uint256 amountOut,
        bytes calldata proof
    \1whenNotPaused nonReentrant external {
        require(msg.sender == thorRelayer, "unauth");
        require(!thorSettled[requestId], "settled");
        thorSettled[requestId] = true;
        require(IERC20(tokenOut).transfer(to, amountOut), "transfer fail");
        emit ThorSettled(requestId, to, tokenOut, amountOut);
    }

    /*---------- ZK Relayer ----------*/
    function requestZKSwap(address tokenIn, uint256 amountIn, string calldata memo\1whenNotPaused nonReentrant external returns (bytes32 requestId)
    {
        _pull(IERC20(tokenIn), msg.sender, amountIn);
        requestId = keccak256(abi.encode(msg.sender, tokenIn, amountIn, memo, block.number));
        emit ZKSwapRequested(requestId, msg.sender, tokenIn, amountIn, memo);
    }

    function settleZKSwap(
        bytes32 requestId,
        address to,
        address tokenOut,
        uint256 amountOut,
        bytes calldata proof
    \1whenNotPaused nonReentrant external {
        require(msg.sender == zkRelayer, "unauth");
        require(!zkSettled[requestId], "settled");
        zkSettled[requestId] = true;
        require(IERC20(tokenOut).transfer(to, amountOut), "transfer fail");
        emit ZKSwapSettled(requestId, to, tokenOut, amountOut);
    }

    /*---------- xStocks Raydium Relayer ----------*/
    function requestXStocksRaySwap(address tokenIn, uint256 amountIn\1whenNotPaused nonReentrant external returns (bytes32 requestId)
    {
        _pull(IERC20(tokenIn), msg.sender, amountIn);
        requestId = keccak256(abi.encode(msg.sender, tokenIn, amountIn, "RAY", block.number));
        emit XStocksRayRequested(requestId, msg.sender, tokenIn, amountIn);
    }

    function settleXStocksRaySwap(bytes32 requestId, address to, uint256 amountOut\1whenNotPaused nonReentrant external {
        require(msg.sender == xStocksRayRelayer, "unauth");
        require(!xStocksRaySettled[requestId], "settled");
        xStocksRaySettled[requestId] = true;
        require(IERC20(to).transfer(to, amountOut), "transfer fail"); // assuming `to` token is xStock
        emit XStocksRaySettled(requestId, to, amountOut);
    }

    /*---------- xStocks Jupiter Relayer ----------*/
    function requestXStocksJupSwap(address tokenIn, uint256 amountIn\1whenNotPaused nonReentrant external returns (bytes32 requestId)
    {
        _pull(IERC20(tokenIn), msg.sender, amountIn);
        requestId = keccak256(abi.encode(msg.sender, tokenIn, amountIn, "JUP", block.number));
        emit XStocksJupRequested(requestId, msg.sender, tokenIn, amountIn);
    }

    function settleXStocksJupSwap(bytes32 requestId, address to, uint256 amountOut\1whenNotPaused nonReentrant external {
        require(msg.sender == xStocksJupRelayer, "unauth");
        require(!xStocksJupSettled[requestId], "settled");
        xStocksJupSettled[requestId] = true;
        require(IERC20(to).transfer(to, amountOut), "transfer fail"); // assuming to is xStock token
        emit XStocksJupSettled(requestId, to, amountOut);
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }


event SwapExecuted(bytes32 indexed venue, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, address to);

function swapWithControls(
    bytes32 venueId,
    address router,
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut,
    uint256 deadline,
    bytes calldata data
) external whenNotPaused nonReentrant returns (uint256 amountOut) {
    if (block.timestamp > deadline) revert Errors.DeadlineExceeded();
    if (router == address(0) || tokenIn == address(0) || tokenOut == address(0)) revert Errors.ZeroAddress();

    IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
    IERC20(tokenIn).safeIncreaseAllowance(router, amountIn);

    (bool ok, bytes memory ret) = router.call(data);
    require(ok, "router call failed");

    if (ret.length >= 32) {
        amountOut = abi.decode(ret, (uint256));
    } else {
        amountOut = IERC20(tokenOut).balanceOf(address(this));
    }

    if (amountOut < minAmountOut) revert Errors.Slippage();
    IERC20(tokenOut).safeTransfer(msg.sender, amountOut);

    emit SwapExecuted(venueId, tokenIn, tokenOut, amountIn, amountOut, msg.sender);
}


function swapWithPermit(
    bytes32 venueId,
    address router,
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 minAmountOut,
    uint256 deadline,
    bytes calldata data,
    // permit params
    uint256 permitDeadline,
    uint8 v, bytes32 r, bytes32 s
) external whenNotPaused nonReentrant returns (uint256 amountOut) {
    if (block.timestamp > deadline) revert Errors.DeadlineExceeded();
    if (router == address(0) || tokenIn == address(0) || tokenOut == address(0)) revert Errors.ZeroAddress();

    PermitHelper.permitAndPull(IERC20(tokenIn), IERC20Permit(tokenIn), msg.sender, address(this), amountIn, permitDeadline, v, r, s);
    IERC20(tokenIn).safeIncreaseAllowance(router, amountIn);

    (bool ok, bytes memory ret) = router.call(data);
    require(ok, "router call failed");

    if (ret.length >= 32) {
        amountOut = abi.decode(ret, (uint256));
    } else {
        amountOut = IERC20(tokenOut).balanceOf(address(this));
    }

    if (amountOut < minAmountOut) revert Errors.Slippage();
    IERC20(tokenOut).safeTransfer(msg.sender, amountOut);

    emit SwapExecuted(venueId, tokenIn, tokenOut, amountIn, amountOut, msg.sender);
}
