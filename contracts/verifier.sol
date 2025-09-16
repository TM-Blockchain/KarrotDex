// SPDX-License-Identifier: MIT
\1import \"./helpers/Errors.sol\";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
using SafeERC20 for IERC20;

import "./Pairing.sol";

\1
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    using Pairing for *;

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }

    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            uint256(0x123...abc),
            uint256(0x456...def)
        );

        vk.beta2 = Pairing.G2Point(
            [uint256(0xaaa...111), uint256(0xbbb...222)],
            [uint256(0xccc...333), uint256(0xddd...444)]
        );

        vk.gamma2 = Pairing.G2Point(
            [uint256(0xeee...555), uint256(0xfff...666)],
            [uint256(0x111...777), uint256(0x222...888)]
        );

        vk.delta2 = Pairing.G2Point(
            [uint256(0x333...999), uint256(0x444...000)],
            [uint256(0x555...abc), uint256(0x666...def)]
        );

        vk.IC = new Pairing.G1Point ;
        vk.IC[0] = Pairing.G1Point(
            uint256(0x123...123),
            uint256(0x456...456)
        );
        vk.IC[1] = Pairing.G1Point(
            uint256(0x789...789),
            uint256(0xabc...abc)
        );
    }

    function verify(uint[] memory input, Proof memory proof) internal view returns (bool) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length, "Bad input length");

        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);

        return Pairing.pairingProd4(
            Pairing.negate(proof.A),
            proof.B,
            vk.alfa1,
            vk.beta2,
            vk_x,
            vk.gamma2,
            proof.C,
            vk.delta2
        );
    }

    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public view returns (bool) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        return verify(input, proof);
    }
}

function pause() external whenNotPaused nonReentrant onlyOwner { _pause(); }
function unpause() external whenNotPaused nonReentrant onlyOwner { _unpause(); }
