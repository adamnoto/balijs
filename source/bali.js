class Bali {
    constructor(rules) {
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

    static mapRules(rules) {
        return new Bali(rules);
    }

    getDefinitions() {
        return this.state.mappedTypes;
    }

    parseRules(rulesObject) {
        for(let role in rulesObject) {
            let ruleDefinition = rulesObject[role];
            ruleDefinition(this.rulerFor(role));
        }
    }

    initializeType(type) {
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

    rulerFor(role) {
        return {
            canAll: (type) => {
                this.initializeType(type);
                this.state.mappedTypes[type].canAll.push(role);
            },
            can: (action, type) => {
                this.initializeType(type);
                let ablers = this.state.mappedTypes[type].can[action];
                if (!ablers) {
                    ablers = this.state.mappedTypes[type].can[action] = [];
                }
                ablers.push(role);
            }
        }
    }

    hasDefinedRole(role) {
      for(let type in this.state.mappedTypes) {
        if (this.state.mappedTypes[type].canAll.indexOf(role) >= 0) return true;
        for (let action in this.state.mappedTypes[type].can) {
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
    can(role, action, type) {
        let _roles = (Object.prototype.toString.call(role) != "[object Array]") ?
          [role] : role;

        for(let i=0; i<_roles.length; i++) {
            let role = _roles[i];
            let typeDefinitions = this.getDefinitions()[type];
            let evaluationResult = false;

            if (typeDefinitions) {
                if (typeDefinitions.can[action]) {
                    evaluationResult = typeDefinitions.can[action]
                        .indexOf(role) >= 0;
                }

                // cannot in the else body, because the action might present
                // but actually there's a canAll rule present as well,
                // but since the all-catch is not within the can body,
                // it is not checked at all.
                if (evaluationResult === false && typeDefinitions.canAll) {
                    evaluationResult = typeDefinitions.canAll
                        .indexOf(role) >= 0;
                }
            }

            // short circuit and return, if already deduct true
            if (evaluationResult === true) return true;
        }

        return false;
    }
}

// for UMD
Bali.globalName = "Bali";
module.exports = Bali;
