var assert = require("assert");
var sinon  = require("sinon");

var fruitmachine  = require("fruitmachine");
var fastdomHelper = require("../");

describe("fruitmachine-fastdom", function() {

  beforeEach(function() {
    var Apple = fruitmachine.define({
      name: 'apple',
      helpers: [
        fastdomHelper
      ]
    });
    this.module = new Apple;
  });

  it("has #fastom ref", function() {
    assert(this.module.fastdom);
  });

  it("has #read", function() {
    assert(this.module.read);
  });

  it("has #write", function() {
    assert(this.module.write);
  });

  it("has #defer", function() {
    assert(this.module.defer);
  });

  it("calls Fastdom#clear on destroy", function() {
    var spy = sinon.spy();
    this.module.fastdom.clear = spy;
    this.module.render().setup();
    this.module.destroy();
    assert(spy.called);
  });

});
