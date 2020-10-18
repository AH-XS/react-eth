pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

enum Sex {Male, Female}

struct Dog {
    string name;
    uint256 dob;
    string microchip;
    uint256 dam;
    uint256 sire;
    Sex sex;
    uint256 timestamp;
}

contract DogERC721 is ERC721, Ownable {
    mapping(address => bool) private _writers;
    mapping(bytes32 => Dog) private _dogs;

    Dog[] public pack;

    string private _name;
    string private _symbol;
    mapping(uint256 => string) private _tokenURIs;
    //uint256 private _fee;

    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    constructor() public ERC721("BEAGLES", "DDA") {
        //_name = "BEAGLES";
        //_symbol = "DDA";
        // register the supported interfaces to conform to ERC721 via ERC165
        //_registerInterface(_INTERFACE_ID_ERC721_METADATA);
    }

    function addLitter(
        uint256 dob,
        uint256 dam,
        uint256 sire,
        uint256 numberOfMales,
        uint256 numberOfFemales,
        address owner
    ) external payable onlyOwner() {
        for (uint256 i = 0; i < numberOfMales; i++) {
            _addPuppy("", dob, "", Sex.Male, dam, sire, owner);
        }

        for (uint256 i = 0; i < numberOfFemales; i++) {
            _addPuppy("", dob, "", Sex.Female, dam, sire, owner);
        }
    }

    function addPuppy(
        string calldata dogsName,
        uint256 dob,
        string calldata microchip,
        Sex sex,
        uint256 dam,
        uint256 sire,
        address owner
    ) external payable onlyOwner() {
        //require(msg.value >= _fee, "Fee too small");

        _addPuppy(dogsName, dob, microchip, sex, dam, sire, owner);
    }

    function _addPuppy(
        string memory dogsName,
        uint256 dob,
        string memory microchip,
        Sex sex,
        uint256 dam,
        uint256 sire,
        address owner
    ) internal {
        uint256 id = pack.length;
        pack.push(Dog(dogsName, dob, microchip, dam, sire, sex, now));

        emit Transfer(owner, owner, id);
        emit PuppyAdded(id);
    }

    function getPuppy(uint256 _tokenId)
        external
        view
        returns (
            string memory,
            uint256,
            Sex,
            uint256,
            uint256
        )
    //address
    {
        //address owner = ownerOf(_tokenId);
        return (
            pack[_tokenId].name,
            pack[_tokenId].dob,
            pack[_tokenId].sex,
            pack[_tokenId].dam,
            pack[_tokenId].sire
            //owner
        );
    }

    function removePuppy(uint256 _tokenId) external onlyOwner() {
        delete pack[_tokenId];

        emit PuppyRemoved(_tokenId);
    }

    function updateTitle(uint256 _tokenId, string calldata _newName)
        external
        onlyOwner()
    {
        pack[_tokenId].name = _newName;
    }

    function updateMicrochip(uint256 _tokenId, string calldata _microchip)
        external
        onlyOwner()
    {
        pack[_tokenId].microchip = _microchip;
    }

    event PuppyAdded(uint256 _tokenId);
    event PuppyRemoved(uint256 _tokenId);
}
