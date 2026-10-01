import { build } from 'esbuild'

await build({
    entryPoints: ['src/server.mts'],
    outfile: 'dist/server.mjs',
    external: ['argon2'],
    bundle: true,
    packages: 'bundle',
    platform: 'node',
    format: 'esm',
    target: 'node24',
    banner: {
        js: `import { createRequire } from 'node:module';
            const require = createRequire(import.meta.url);`
    }
})
