"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bali = function () {
    function Bali(rules) {
        _classCallCheck(this, Bali);

        this.state = {
            // {
            //   "leave": {
            //      canAll: ["ALL_LEAVE"],
            //      see: ["SEE_LEAVE"]
            //   }
            // }
            mappedTypes: {}
        };

        this.parseRules(rules);
    }

    _createClass(Bali, [{
        key: "getDefinitions",
        value: function getDefinitions() {
            return this.state.mappedTypes;
        }
    }, {
        key: "parseRules",
        value: function parseRules(rulesObject) {
            for (var role in rulesObject) {
                var ruleDefinition = rulesObject[role];
                ruleDefinition(this.rulerFor(role));
            }
        }
    }, {
        key: "initializeType",
        value: function initializeType(type) {
            if (!this.state.mappedTypes[type]) {
                this.state.mappedTypes[type] = {
                    canAll: [],
                    // list of all cans: can: {leave: [role1, role2]}
                    can: {},
                    // list of all cannots: cannot: {leave: [role1, role2]}]
                    cannot: {}
                };
            }
        }
    }, {
        key: "rulerFor",
        value: function rulerFor(role) {
            var _this = this;

            return {
                canAll: function canAll(type) {
                    _this.initializeType(type);
                    _this.state.mappedTypes[type].canAll.push(role);
                },
                can: function can(action, type) {
                    _this.initializeType(type);
                    var ablers = _this.state.mappedTypes[type].can[action];
                    if (!ablers) {
                        ablers = _this.state.mappedTypes[type].can[action] = [];
                    }
                    ablers.push(role);
                }
            };
        }
    }, {
        key: "hasDefinedRole",
        value: function hasDefinedRole(role) {
            for (var type in this.state.mappedTypes) {
                if (this.state.mappedTypes[type].canAll.indexOf(role) >= 0) return true;
                for (var action in this.state.mappedTypes[type].can) {
                    if (this.state.mappedTypes[type].can[action].indexOf(role) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        // role = the person, role, privilege.
        // action = what is he doing? see, print, etc.
        // type = type of data, "leave", "reimburse", etc.

    }, {
        key: "can",
        value: function can(role, action, type) {
            var _roles = Object.prototype.toString.call(role) != "[object Array]" ? [role] : role;

            for (var i = 0; i < _roles.length; i++) {
                var _role = _roles[i];
                var typeDefinitions = this.getDefinitions()[type];
                var evaluationResult = false;

                if (typeDefinitions) {
                    if (typeDefinitions.can[action]) {
                        evaluationResult = typeDefinitions.can[action].indexOf(_role) >= 0;
                    }

                    // cannot in the else body, because the action might present
                    // but actually there's a canAll rule present as well,
                    // but since the all-catch is not within the can body,
                    // it is not checked at all.
                    if (evaluationResult === false && typeDefinitions.canAll) {
                        evaluationResult = typeDefinitions.canAll.indexOf(_role) >= 0;
                    }
                }

                // short circuit and return, if already deduct true
                if (evaluationResult === true) return true;
            }

            return false;
        }
    }], [{
        key: "mapRules",
        value: function mapRules(rules) {
            return new Bali(rules);
        }
    }]);

    return Bali;
}();

// for UMD


Bali.globalName = "Bali";
module.exports = Bali;