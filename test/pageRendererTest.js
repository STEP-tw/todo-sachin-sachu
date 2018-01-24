const chai=require('chai');
const assert=chai.assert;

const pageRenderer=require('../scripts/pageRenderer.js');

describe("pageRenderer",()=>{
  describe("# removeText()",()=>{
    it('should remove the target text from contents',()=>{
      let sampleText="<html>REMOVE_THIS</html>";
      let expected="<html></html>";
      assert.equal(pageRenderer.removeText(sampleText,'REMOVE_THIS'),expected);
    })
  })
})
