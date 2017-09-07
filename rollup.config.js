import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'

const Plugins = (config = {}) => [
  resolve({
    module: true, browser: true, jsnext: true, main: true, extensions: [ '.js', '.json' ]
  }),
  commonjs(),
  svelte(Object.assign({ cascade: false }, config.svelte))
]

export default [
  {
    input: 'src/Scrim.html',
    output: {
      file: 'build/Scrim.js',
      format: 'es',
    },
    plugins: Plugins()
  },

  {
    input: 'src/Scrim.html',
    output: {
      file: 'build/Scrim.cjs.js',
      format: 'cjs',
    },
    plugins: Plugins()
  },

  {
    input: 'src/Scrim.html',
    output: {
      file: 'element/index.js',
      format: 'es',
    },
    plugins: Plugins({ svelte: { customElement: true } })
  }
]
