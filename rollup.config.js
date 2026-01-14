import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.js",
    output: [
      { file: "dist/index.esm.js", format: "esm" },
      { file: "dist/index.cjs.js", format: "cjs" }
    ],
    plugins: [resolve()]
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "deltatrack"
    },
    plugins: [resolve()]
  }
];
