import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/ux-lang.min.js',
      format: 'iife',
      name: 'ux',
      plugins: [
        terser({
          format: {
            ascii_only: true,
          }
        })
      ]
    }
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    json({ namedExports: false }),
    nodePolyfills(),
    {
      banner() {
        return `/*! ${pkg.name} ${pkg.version} ${pkg.repository.url} @license ${pkg.license} */`;
      }
    }
  ]
};
