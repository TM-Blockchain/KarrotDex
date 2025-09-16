// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

import "./Verifier.sol";

contract Unlocker is Verifier, Ownable, ReentrancyGuard, Pausable, AccessControl {
    address public owner;
    mapping(bytes32 => bool) public usedNullifiers;

    event Unlock(address indexed user, string symbol, uint256 amount, bytes32 burnId);

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        owner = msg.sender;
    }

    function unlockWithZKProof(
        address user,
        string memory symbol,
        uint256 amount,
        bytes32 burnId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    \1whenNotPaused nonReentrant external {
        require(!usedNullifiers[burnId], "Burn ID already processed");

        bool success = verifyProof(a, b, c, input);
        require(success, "Invalid zk proof");

        usedNullifiers[burnId] = true;

        emit Unlock(user, symbol, amount, burnId);
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
