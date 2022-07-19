module.exports = {
    root: true,
    extends: 'eslint:recommended',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6
    },
    rules: {
        'linebreak-style': ['error', 'unix'],
        semi: ['error', 'always'],

        'comma-dangle': ['error', 'never'],
        'no-cond-assign': ['error', 'always'],

        'no-unused-vars': 'off',
        'no-console': 'warn',
        'no-useless-escape': 'off'
    },
    env: {
        browser: true,
        node: true
    },
    globals: {
        Modulr: 'readonly'
    }
};
