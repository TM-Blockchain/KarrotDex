import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;
// TypeScript off-chain daemon
pulseProvider.on("PxAssetBurned", async (symbol, user, amount, burnId, event) => {
  const proof = generateBurnProof(event); // capture log, block info, tx hash

  await sendToSolana({
    symbol,
    user,
    amount,
    burnId,
    proof,
  });
});

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
