import nextConfig from 'eslint-config-next';

// Next 16 dropped `next lint`. This is the flat config that package now exports.
const config = [
    ...nextConfig,
    {
        ignores: [
            'graphify-out/**',
            '_to_delete/**',
            '_parked/**',
            // Skill dumps, not the app. `.agent/` is the unpruned duplicate tree.
            '.agent/**',
            '.agents/**',
            // Written record of the tables. Excluded from tsconfig because nothing imports it.
            'lib/db/schema.ts',
        ],
    },
    {
        rules: {
            // These two rules flag patterns this app uses on purpose: reading
            // localStorage or the in-app browser after mount, and Date.now()
            // to decide whether a share nudge is old enough. Rewriting them
            // would change hydration, not cleanliness.
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/purity': 'off',
        },
    },
];

export default config;
