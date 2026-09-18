import type { Block } from '@/data/guides';

/**
 * Renders a guide's typed content blocks.
 *
 * Shared by `/technology/[slug]` and `/blog/[slug]` — both route families serve
 * the same published article set, so they must render from one implementation
 * rather than two copies that can drift apart.
 *
 * Heading levels are emitted as real `h2` / `h3` elements. The page owns the
 * single `h1`; nothing in here can promote content to `h1`.
 */
export function GuideBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;

        switch (block.type) {
          case 'p':
            return (
              <p key={key} className="text-base leading-relaxed text-steel-700">
                {block.text}
              </p>
            );

          case 'h2':
            return (
              <h2
                key={key}
                className="pt-4 text-xl font-bold tracking-tight text-navy-900 sm:text-2xl"
              >
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3 key={key} className="pt-2 text-lg font-bold tracking-tight text-navy-900">
                {block.text}
              </h3>
            );

          case 'ul':
            return (
              <ul key={key} className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed text-steel-700">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'table':
            return (
              <div key={key} className="overflow-x-auto rounded-card border border-steel-200">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm sm:min-w-0">
                  {block.caption ? (
                    <caption className="border-b border-steel-200 bg-steel-50 px-4 py-3 text-left text-sm font-semibold text-navy-900">
                      {block.caption}
                    </caption>
                  ) : null}
                  <thead>
                    <tr className="border-b border-steel-200 bg-steel-50">
                      {block.head.map((cell) => (
                        <th
                          key={cell}
                          scope="col"
                          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr
                        key={`${key}-r${r}`}
                        className="border-b border-steel-100 last:border-0 even:bg-steel-50/60"
                      >
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th
                              key={`${key}-r${r}c${c}`}
                              scope="row"
                              className="px-4 py-3 align-top font-semibold text-navy-900"
                            >
                              {cell}
                            </th>
                          ) : (
                            <td
                              key={`${key}-r${r}c${c}`}
                              className="px-4 py-3 align-top text-steel-700"
                            >
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'callout':
            return (
              <aside
                key={key}
                className="rounded-card border border-navy-100 bg-navy-50 p-5 sm:p-6"
              >
                <p className="text-sm font-bold uppercase tracking-wider text-navy-700">
                  {block.title}
                </p>
                <p className="mt-2.5 text-base leading-relaxed text-steel-700">{block.text}</p>
              </aside>
            );
        }
      })}
    </div>
  );
}
