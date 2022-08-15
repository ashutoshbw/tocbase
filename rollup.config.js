import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json";
const input = ["src/index.js"];

export default [
  // UMD
  {
    input,
    watch: {
      include: './src/**',
      clearScreen: false
    },
    output: {
      file: `./dist/umd/${pkg.name}.min.js`,
      format: 'umd',
      name: "powerToc",
      exports: "default",
      esModule: false,
      plugins: [
        terser({
          ecma: 2020,
          mangle: { toplevel: true },
          compress: {
            module: true,
            toplevel: true,
            unsafe_arrows: true,
            drop_console: true,
            drop_debugger: true,
          },
          output: { quote_style: 1 }
        })
      ],
    },
  },
  // CJS and ESM
  {
    input,
    output: [
      {
        dir: 'dist/esm',
        format: "esm",
        exports: "named",
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
      },
    ],
  }
]

