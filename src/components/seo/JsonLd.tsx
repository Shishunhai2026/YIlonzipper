/**
 * Renders a JSON-LD block.
 *
 * `JSON.stringify` output is escaped for the two sequences that can break out of
 * a <script> context. Data here comes from our own source files rather than user
 * input, but escaping keeps that guarantee independent of future data sources.
 */
export function JsonLd({ id, data }: { id: string; data: unknown }) {
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');

  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
