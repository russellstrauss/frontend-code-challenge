import vue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      vue,
    },
    rules: {
      ...vue.configs['vue3-essential'].rules,
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];

