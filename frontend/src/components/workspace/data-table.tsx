import type { ReactNode } from 'react'

type Column<T> = {
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

/**
 * A plain, dense table shared by every workspace list (IOCs, actors,
 * phishing domains, fraud cases, incidents). Columns are declared by the
 * caller rather than inferred from the row shape, so a table never
 * accidentally renders a column the design didn't intend to show.
 */
export function DataTable<T extends { id: number }>({
  columns,
  rows,
}: {
  columns: Column<T>[]
  rows: T[]
}) {
  return (
    <div className="-mx-6 overflow-x-auto lg:-mx-7">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line-soft text-left text-xs uppercase tracking-wide text-muted-2">
            {columns.map((col) => (
              <th key={col.header} className="whitespace-nowrap px-6 py-3 font-medium lg:px-7">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-line-soft/60 transition-colors last:border-0 hover:bg-ink-3/60"
            >
              {columns.map((col) => (
                <td key={col.header} className={`px-6 py-3 text-body lg:px-7 ${col.className ?? ''}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
