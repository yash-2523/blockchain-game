const { assert } = require('chai');

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let memoryToken;
  before(async () => {
    memoryToken = await MemoryToken.deployed();
  })
  describe("deployment" , async () => {
    it("test name", async () => {
      const name = await memoryToken.name();
      assert.equal(name,"memory")
    })
  })
  describe("token distribution", async () => {
    let result;
    it("mints token", async () => {
      await memoryToken.mint(accounts[0],'https://www.token-uri.com/nft')
      await memoryToken.mint(accounts[0],'https://www.token-uri.com/nft')

      result = await memoryToken.totalSupply()
      assert.equal(result.toString(),'2', 'total supply is correct')

      result = await memoryToken.balanceOf(accounts[0]);
      assert.equal(result.toString(),'2')

      result = await memoryToken.ownerOf('1')
      assert.equal(result.toString(),accounts[0].toString())

      let balanceOf = await memoryToken.balanceOf(accounts[0]);
      let tokenIds = [];

      for(let i=0;i<balanceOf;i++){
        let id = await memoryToken.tokenOfOwnerByIndex(accounts[0],i);
        tokenIds.push(id.toString())
      }
      assert.equal(tokenIds.toString(),['1','2'].toString());
    })
  })
})
