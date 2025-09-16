\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract pxAsset is ERC20, Ownable, ReentrancyGuard, Pausable, AccessControl {
    address public minter;

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        minter = msg.sender;
    }

    function mint(address to, uint amount\1whenNotPaused nonReentrant external {
        require(msg.sender == minter, "Only minter");
        _mint(to, amount);
    }

    function burn(address from, uint amount\1whenNotPaused nonReentrant external {
        require(msg.sender == minter, "Only minter");
        _burn(from, amount);
    }
}


function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
