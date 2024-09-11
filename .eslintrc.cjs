module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:react/jsx-runtime'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json']
  },
  plugins: ['react', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/prefer-nullish-coalescing': 0,
    'react/prop-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react', '^@?\\w'], // react放在首行
          ['^(@|components)(/.*|$)'], // 内部导入
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // 父级导入. 把 `..` 放在最后.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // 同级导入. 把同一个文件夹.放在最后
          ['^.+\\.?(css)$', '\'^.+\\\\.?(less)$\''], // 样式导入.
          ['^\\u0000'], // 带有副作用导入，比如import 'a.css'这种.
        ]
      }
    ],
    'react/jsx-no-leaked-render': ['error'],
    'react/jsx-tag-spacing': ['error', {}],
    'react/jsx-wrap-multilines': ['error', {}],
    'react/jsx-closing-bracket-location': ['error', {
      "nonEmpty": "tag-aligned",
      "selfClosing": "line-aligned"
    }],
    'react/jsx-first-prop-new-line': ['error'],
    "react/jsx-indent-props": ['error', 2],
    'react/jsx-indent': ["error", 2],
    "react/jsx-closing-tag-location": 'error',
    "react/no-adjacent-inline-elements":"error",
    'react/jsx-child-element-spacing': 2,
    "react/self-closing-comp": ["error", {
      "component": true,
      "html": true
    }],
    "react/jsx-curly-brace-presence": ['error', { props: "always", children: "never" }],
    'no-extra-boolean-cast': 'error',
    'react/jsx-curly-spacing': [2, {"when": "never", "children": true }],
    'react/jsx-no-useless-fragment': 2,
    'react/jsx-curly-newline': [
      "error",
      {
        "multiline": "consistent",
        "singleline": "consistent"
      }
    ],
    'simple-import-sort/exports': 'error',// 导出
    'import/no-duplicates': 'error',// 合并同一个导入。ide自动导入，会导致impoprt {a} from 'A'和impoprt {a1} from 'A'导入2次
    'import/first': 'error', // 确保所有导入位于文件的顶部
    'import/newline-after-import': 'error' // 确保在导入后有换行符
  }
}
