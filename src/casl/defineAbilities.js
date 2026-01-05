import {AbilityBuilder, createMongoAbility} from '@casl/ability';

// Change this line

export const defineAbilities = (caslJson = {}) => {
  // Added default = {}
  const {can, rules} = new AbilityBuilder(createMongoAbility);

  // Added a check to prevent crashes if caslJson is null
  if (caslJson) {
    Object.entries(caslJson).forEach(([subject, actions]) => {
      // Added check to ensure actions is an array
      if (Array.isArray(actions)) {
        actions.forEach(action => {
          can(action, subject);
        });
      }
    });
  }

  return createMongoAbility(rules);
};
