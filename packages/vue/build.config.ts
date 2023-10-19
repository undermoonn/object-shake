import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  declaration: true,
  rollup: {
    esbuild: {
      minify: true,
      target: 'es6'
    },
    emitCJS: true
  }
})
