import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Native flat config, as shipped by eslint-config-next 16.
 *
 * An earlier revision used FlatCompat to bridge the legacy `next/...` shareable
 * configs. That worked on Next 15 but throws on the v16 configs, so the direct
 * imports above are the supported form.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'var/**']),
  {
    rules: {
      // Product and company copy legitimately contains apostrophes and quotes.
      'react/no-unescaped-entities': 'off',
    },
  },
]);

export default eslintConfig;
