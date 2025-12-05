module.exports = {
  extends: [
    // 阿里前端规约
    'eslint-config-ali/typescript/react',
    // Prettier 插件核心配置
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  rules: {
    // --- 核心：将 Prettier 的格式问题作为 ESLint 警告抛出 ---
    // 'prettier/prettier': ['warn', prettierConfig],

    // --- 降低部分规则等级 ---
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/display-name': 'warn',
    'react-hooks/exhaustive-deps': 'warn',

    // --- 解决 Umi 兼容性 ---
    '@typescript-eslint/no-var-requires': 'off',

    // 确保 ESLint 不会去管这些格式问题
    indent: 'off',
    '@typescript-eslint/indent': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
