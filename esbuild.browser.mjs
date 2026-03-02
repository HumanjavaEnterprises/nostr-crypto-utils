import { build } from 'esbuild';
import path from 'path';

// Plugin to stub Node builtins that aren't needed in browser
// (noble/scure libs are browser-native; only buffer is needed for NIP-19)
const emptyNodeBuiltins = {
  name: 'empty-node-builtins',
  setup(build) {
    const builtins = ['crypto', 'stream', 'os', 'fs', 'http', 'https',
      'path', 'util', 'zlib', 'vm', 'assert', 'net', 'tls', 'child_process'];
    const filter = new RegExp(`^(${builtins.join('|')})$`);

    build.onResolve({ filter }, (args) => ({
      path: args.path,
      namespace: 'empty-node-builtin',
    }));

    build.onLoad({ filter: /.*/, namespace: 'empty-node-builtin' }, () => ({
      contents: 'export default {};',
      loader: 'js',
    }));
  },
};

// Entry points matching original webpack config
const entries = [
  { entry: 'src/index.ts',              name: 'main',       globalName: 'NostrCryptoUtils' },
  { entry: 'src/crypto.ts',             name: 'crypto',     globalName: 'NostrCryptoUtils.Crypto' },
  { entry: 'src/utils/validation.ts',   name: 'validation', globalName: 'NostrCryptoUtils.Validation' },
  { entry: 'src/protocol/index.ts',     name: 'protocol',   globalName: 'NostrCryptoUtils.Protocol' },
  { entry: 'src/nips/nip-44.ts',        name: 'nip-44',     globalName: 'NostrCryptoUtils.NIP44' },
  { entry: 'src/nips/nip-46.ts',        name: 'nip-46',     globalName: 'NostrCryptoUtils.NIP46' },
  { entry: 'src/nips/nip-49.ts',        name: 'nip-49',     globalName: 'NostrCryptoUtils.NIP49' },
];

const sharedOptions = {
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  target: ['es2020'],
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [emptyNodeBuiltins],
};

// Build all entry points
const results = await Promise.all(
  entries.map(({ entry, name, globalName }) =>
    build({
      ...sharedOptions,
      entryPoints: [entry],
      globalName,
      outfile: `dist/browser/${name}.nostr-crypto-utils.min.js`,
      metafile: true,
    })
  )
);

// Print bundle sizes
for (let i = 0; i < results.length; i++) {
  const { metafile } = results[i];
  const output = Object.entries(metafile.outputs)
    .filter(([k]) => k.endsWith('.js'))
    .map(([k, v]) => `${(v.bytes / 1024).toFixed(1)}KB`);
  console.log(`  ${entries[i].name}: ${output.join(', ')}`);
}
console.log('All browser bundles built.');
