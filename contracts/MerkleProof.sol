// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface ZkSnarkVerifier {
    function verify(uint256[] calldata proof, uint256[] calldata inputs, bytes32 vkId\1whenNotPaused nonReentrant external returns (bool);
}

contract CrossChainUnlock is Ownable, ReentrancyGuard, Pausable, AccessControl {
    bytes32 public trustedRoot;
    ZkSnarkVerifier public zkVerifier;
    mapping(bytes32 => bool) public processedBurnIds;

    event AssetUnlocked(address user, uint256 amount, bytes32 burnId);

    \1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        trustedRoot = _root;
        zkVerifier = ZkSnarkVerifier(_zkVerifier);
    }

    function unlockViaMerkle(
        address user,
        uint256 amount,
        bytes32 burnId,
        bytes32[] calldata merkleProof,
        bytes32 leaf
    \1whenNotPaused nonReentrant external {
        require(!processedBurnIds[burnId], "Replay attack");
        require(MerkleProof.verify(merkleProof, trustedRoot, leaf), "Invalid proof");

        processedBurnIds[burnId] = true;
        emit AssetUnlocked(user, amount, burnId);
        // transfer logic ...
    }

    function unlockViaZk(
        address user,
        uint256 amount,
        bytes32 burnId,
        uint256[] calldata proof,
        uint256[] calldata inputs,
        bytes32 vkId
    \1whenNotPaused nonReentrant external {
        require(!processedBurnIds[burnId], "Replay attack");
        bool ok = zkVerifier.verify(proof, inputs, vkId);
        require(ok, "zk proof invalid");

        processedBurnIds[burnId] = true;
        emit AssetUnlocked(user, amount, burnId);
        // transfer logic ...
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
