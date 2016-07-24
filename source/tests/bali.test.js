import Bali from '../bali';
import { describe } from "mocha";
import { expect } from "chai";

describe("Bali", () => {
  var authorizer;

  describe("Without canAll", () => {
    before(() => {
      authorizer = Bali.mapRules({
        "SEE_LEAVE": (ruler) => { ruler.can("see", "leave"); },
        "APPROVE_LEAVE": (ruler) => { ruler.can("approve", "leave"); }
      });
    });

    describe("authorize to see leave data", () => {
      it("passed SEE_LEAVE as array", () => {
        expect(authorizer.can(["SEE_LEAVE"], "see", "leave")).to.eq(true);
      });

      it("passed SEE_LEAVE as string literal", () => {
        expect(authorizer.can("SEE_LEAVE", "see", "leave")).to.eq(true);
      });
    })

    describe("multi-role array", () => {
      it("can make good judgement too", () => {
        expect(authorizer.can(["NONEXIST", "SEE_LEAVE", "APPROVE_LEAVE"], "see", "leave")).to.eq(true);
        expect(authorizer.can(["NONEXIST", "SEE_LEAVE", "APPROVE_LEAVE"], "approve", "leave")).to.eq(true);
        expect(authorizer.can(["NONEXIST", "SEE_LEAVE", "APPROVE_LEAVE"], "delete", "leave")).to.eq(false);
      })
    })

    it("can assess role logically correct", () => {
      expect(authorizer.can("SEE_LEAVE", "approve", "leave")).to.eq(false);
      expect(authorizer.hasDefinedRole("APPROVE_LEAVE")).to.eq(true);
      expect(authorizer.can("APPROVE_LEAVE", "approve", "leave")).to.eq(true);
      expect(authorizer.hasDefinedRole("NONEXIST")).to.eq(false);
      expect(authorizer.can("NONEXIST", "approve", "leave")).to.eq(false);
    });
  });

  describe("With canAll", () => {
    before(() => {
      authorizer = Bali.mapRules({
        "ALL_LEAVE": (ruler) => { ruler.canAll("leave"); },
        "SEE_LEAVE": (ruler) => { ruler.can("see", "leave"); },
        "APPROVE_LEAVE": (ruler) => { ruler.can("approve", "leave"); }
      });
    });

    describe("test can all role (ALL_LEAVE)", () => {
      it("can do anything", () => {
        expect(authorizer.hasDefinedRole("ALL_LEAVE")).to.eq(true);
        expect(authorizer.can("ALL_LEAVE", "approve", "leave")).to.eq(true);
        expect(authorizer.can("ALL_LEAVE", "see", "leave")).to.eq(true);
        expect(authorizer.can(["SEE_LEAVE", "ALL_LEAVE"], "approve", "leave")).to.eq(true);
        // even when not defined
        expect(authorizer.can("ALL_LEAVE", "delete", "leave")).to.eq(true);
      });
    })

    it("can assess role logically correct", () => {
      expect(authorizer.can("APPROVE_LEAVE", "approve", "leave")).to.eq(true);
      expect(authorizer.can("SEE_LEAVE", "approve", "leave")).to.eq(false);
    });
  });
});
