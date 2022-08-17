import { terser } from 'rollup-plugin-terser';
const input_CJS_ESM = ["src/index.js"];
const inputUMD = ["src/index.umd.js"];

export default [
  // UMD
  {
    input: inputUMD,
    watch: {
      include: './src/**',
      clearScreen: false
    },
    output: {
      file: `./dist/cdn.min.js`,
      format: 'umd',
      name: "tocPlease",
      exports: "default",
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
    input: input_CJS_ESM,
    output: [
      {
        file: `./dist/index.js`,
        format: "es",
        exports: "named",
      },
      {
        file: `./dist/index.cjs`,
        format: "cjs",
        exports: "named",
      },
    ],
  }
]

