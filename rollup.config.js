import { terser } from 'rollup-plugin-terser';
const input_CJS_ESM = ["src/index.js"];
const inputUMD = ["src/index.umd.js"];

const terserConfig = {
  ecma: 2022,
  mangle: { toplevel: true },
  compress: {
    module: true,
    toplevel: true,
    unsafe_arrows: true,
    drop_console: true,
    drop_debugger: true,
  },
  output: { quote_style: 1 }
};

export default [
  // UMD
  {
    input: inputUMD,
    watch: {
      include: './src/**',
      clearScreen: false
    },
    output: {
      file: `./dist/cdn.umd.min.js`,
      format: 'umd',
      name: "baseToc",
      exports: "default",
      plugins: [terser(terserConfig)],
    },
  },
  // CJS and ESM
  {
    input: input_CJS_ESM,
    output: [
      {
        file: `./dist/cdn.es.min.js`,
        format: "es",
        exports: "named",
        plugins: [terser(terserConfig)],
      },
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
