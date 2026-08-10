const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
    linterOptions: {
      reportUnusedDisableDirectives: 0,
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        PopStateEvent: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
      },
    },
    rules: {
      ...reactHooksPlugin.configs.flat.recommended.rules,
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.errors.rules,
      ...importPlugin.flatConfigs.warnings.rules,
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^error$', varsIgnorePattern: '^(React|_)' },
      ],
    },
  },
];
