"use strict";

var _bali = require("../bali");

var _bali2 = _interopRequireDefault(_bali);

var _mocha = require("mocha");

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)("Bali", function () {
  var authorizer;

  (0, _mocha.describe)("Without canAll", function () {
    before(function () {
      authorizer = _bali2.default.mapRules({
        "SEE_LEAVE": function SEE_LEAVE(ruler) {
          ruler.can("see", "leave");
        },
        "APPROVE_LEAVE": function APPROVE_LEAVE(ruler) {
          ruler.can("approve", "leave");
        }
      });
    });

    (0, _mocha.describe)("authorize to see leave data", function () {
      it("passed SEE_LEAVE as array", function () {
        (0, _chai.expect)(authorizer.can(["SEE_LEAVE"], "see", "leave")).to.eq(true);
      });

      it("passed SEE_LEAVE as string literal", function () {
        (0, _chai.expect)(authorizer.can("SEE_LEAVE", "see", "leave")).to.eq(true);
      });
    });

    (0, _mocha.describe)("multi-role array", function () {
      it("can make good judgement too", function () {
        (0, _chai.expect)(authorizer.can(["NONEXIST", "SEE_LEAVE", "APPROVE_LEAVE"], "see", "leave")).to.eq(true);
        (0, _chai.expect)(authorizer.can(["NONEXIST", "SEE_LEAVE", "APPROVE_LEAVE"], "approve", "leave")).to.eq(true);
        (0, _chai.expect)(authorizer.can(["NONEXIST", "SEE_LEAVE", "APPROVE_LEAVE"], "delete", "leave")).to.eq(false);
      });
    });

    it("can assess role logically correct", function () {
      (0, _chai.expect)(authorizer.can("SEE_LEAVE", "approve", "leave")).to.eq(false);
      (0, _chai.expect)(authorizer.hasDefinedRole("APPROVE_LEAVE")).to.eq(true);
      (0, _chai.expect)(authorizer.can("APPROVE_LEAVE", "approve", "leave")).to.eq(true);
      (0, _chai.expect)(authorizer.hasDefinedRole("NONEXIST")).to.eq(false);
      (0, _chai.expect)(authorizer.can("NONEXIST", "approve", "leave")).to.eq(false);
    });
  });

  (0, _mocha.describe)("With canAll", function () {
    before(function () {
      authorizer = _bali2.default.mapRules({
        "ALL_LEAVE": function ALL_LEAVE(ruler) {
          ruler.canAll("leave");
        },
        "SEE_LEAVE": function SEE_LEAVE(ruler) {
          ruler.can("see", "leave");
        },
        "APPROVE_LEAVE": function APPROVE_LEAVE(ruler) {
          ruler.can("approve", "leave");
        }
      });
    });

    (0, _mocha.describe)("test can all role (ALL_LEAVE)", function () {
      it("can do anything", function () {
        (0, _chai.expect)(authorizer.hasDefinedRole("ALL_LEAVE")).to.eq(true);
        (0, _chai.expect)(authorizer.can("ALL_LEAVE", "approve", "leave")).to.eq(true);
        (0, _chai.expect)(authorizer.can("ALL_LEAVE", "see", "leave")).to.eq(true);
        (0, _chai.expect)(authorizer.can(["SEE_LEAVE", "ALL_LEAVE"], "approve", "leave")).to.eq(true);
        // even when not defined
        (0, _chai.expect)(authorizer.can("ALL_LEAVE", "delete", "leave")).to.eq(true);
      });
    });

    it("can assess role logically correct", function () {
      (0, _chai.expect)(authorizer.can("APPROVE_LEAVE", "approve", "leave")).to.eq(true);
      (0, _chai.expect)(authorizer.can("SEE_LEAVE", "approve", "leave")).to.eq(false);
    });
  });
});