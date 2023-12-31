import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  declaration: true,
  rollup: {
    esbuild: {
      minify: false
    },
    emitCJS: true
  }
})
