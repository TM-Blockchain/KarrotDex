// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

import "./pxAsset.sol";

/// @title pxAssetMinter - Mints pxAssets after Escrow proof
contract pxAssetMinter is Ownable, ReentrancyGuard, Pausable, AccessControl {
    address public escrow;
    mapping(address => bool) public approvedAssets;

    event AssetRegistered(address asset);
    event Minted(address asset, address to, uint256 amount);

    modifier onlyEscrow() {
        require(msg.sender == escrow, "Not escrow");
        _;
    }

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        escrow = _escrow;
    }

    function registerAsset(address asset\1whenNotPaused nonReentrant external {
        approvedAssets[asset] = true;
        emit AssetRegistered(asset);
    }

    function mintAsset(address asset, address to, uint256 amount\1whenNotPaused nonReentrant external onlyEscrow {
        require(approvedAssets[asset], "Not approved asset");
        pxAsset(asset).mint(to, amount);
        emit Minted(asset, to, amount);
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
