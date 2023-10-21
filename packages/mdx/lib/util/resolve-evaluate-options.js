/**
 * @typedef {import('hast-util-to-jsx-runtime').Fragment} Fragment
 * @typedef {import('hast-util-to-jsx-runtime').Jsx} Jsx
 * @typedef {import('hast-util-to-jsx-runtime').JsxDev} JsxDev
 * @typedef {import('mdx/types.js').MDXComponents} Components
 * @typedef {import('../compile.js').CompileOptions} CompileOptions
 */

/**
 * @typedef {EvaluateProcessorOptions & RunOptions} EvaluateOptions
 *   Configuration for `evaluate`.
 *
 * @typedef {Omit<CompileOptions, 'jsx' | 'jsxImportSource' | 'jsxRuntime' | 'outputFormat' | 'pragma' | 'pragmaFrag' | 'pragmaImportSource' | 'providerImportSource'> } EvaluateProcessorOptions
 *   Compile configuration without JSX options for evaluation.
 *
 * @typedef RunOptions
 *   Configuration to run compiled code.
 *
 *   `Fragment`, `jsx`, and `jsxs` are used when the code is compiled in
 *   production mode (`development: false`).
 *   `Fragment` and `jsxDEV` are used when compiled in development mode
 *   (`development: true`).
 *   `useMDXComponents` is used when the code is compiled with
 *   `providerImportSource: '#'` (the exact value of this compile option
 *   doesn’t matter).
 * @property {Fragment} Fragment
 *   Symbol to use for fragments (**required**).
 * @property {Jsx | null | undefined} [jsx]
 *   Function to generate an element with static children in production mode.
 * @property {JsxDev | null | undefined} [jsxDEV]
 *   Function to generate an element in development mode.
 * @property {Jsx | null | undefined} [jsxs]
 *   Function to generate an element with dynamic children in production mode.
 * @property {UseMdxComponents | null | undefined} [useMDXComponents]
 *   Function to get components from context.
 *
 * @callback UseMdxComponents
 *   Get components from context.
 * @returns {Components}
 *   Current components.
 */

// Fix to show references to above types in VS Code.
''

/**
 * Split compiletime options from runtime options.
 *
 * @param {Readonly<EvaluateOptions> | null | undefined} options
 *   Configuration.
 * @returns {{compiletime: CompileOptions, runtime: RunOptions}}
 *   Split options.
 */
export function resolveEvaluateOptions(options) {
  const {Fragment, development, jsx, jsxDEV, jsxs, useMDXComponents, ...rest} =
    options || {}

  if (!Fragment) throw new Error('Expected `Fragment` given to `evaluate`')
  if (development) {
    if (!jsxDEV) throw new Error('Expected `jsxDEV` given to `evaluate`')
  } else {
    if (!jsx) throw new Error('Expected `jsx` given to `evaluate`')
    if (!jsxs) throw new Error('Expected `jsxs` given to `evaluate`')
  }

  return {
    compiletime: {
      ...rest,
      development,
      outputFormat: 'function-body',
      providerImportSource: useMDXComponents ? '#' : undefined
    },
    runtime: {Fragment, jsx, jsxDEV, jsxs, useMDXComponents}
  }
}
