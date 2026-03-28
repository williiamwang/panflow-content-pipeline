import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'

type StoreItem = {
  source_link: string
  new_share_link: string
}

export type RuntimeDb = {
  SQL: SqlJsStatic
  db: Database
}

let sqlRuntimePromise: Promise<SqlJsStatic> | null = null
let runtimeDbPromise: Promise<RuntimeDb> | null = null

async function getSqlRuntime(): Promise<SqlJsStatic> {
  if (!sqlRuntimePromise) {
    sqlRuntimePromise = initSqlJs()
  }

  return sqlRuntimePromise
}

export async function createRuntimeDb(path: string): Promise<RuntimeDb> {
  const SQL = await getSqlRuntime()
  const db = new SQL.Database()

  db.run(`
    CREATE TABLE IF NOT EXISTS pan_items (
      source_link TEXT PRIMARY KEY,
      new_share_link TEXT NOT NULL
    );
  `)

  if (path === ':memory:') {
    return { SQL, db }
  }

  return { SQL, db }
}

export async function getRuntimeDb(path = ':memory:'): Promise<RuntimeDb> {
  if (!runtimeDbPromise) {
    runtimeDbPromise = createRuntimeDb(path)
  }

  return runtimeDbPromise
}

export function getBySourceLink(runtimeDb: RuntimeDb, sourceLink: string): StoreItem | undefined {
  const stmt = runtimeDb.db.prepare(
    'SELECT source_link, new_share_link FROM pan_items WHERE source_link = ? LIMIT 1',
  )

  try {
    stmt.bind([sourceLink])
    if (!stmt.step()) return undefined

    const row = stmt.getAsObject() as { source_link: string; new_share_link: string }
    return {
      source_link: row.source_link,
      new_share_link: row.new_share_link,
    }
  } finally {
    stmt.free()
  }
}

export function saveItem(runtimeDb: RuntimeDb, item: StoreItem): void {
  runtimeDb.db.run(
    'INSERT OR REPLACE INTO pan_items (source_link, new_share_link) VALUES (?, ?)',
    [item.source_link, item.new_share_link],
  )
}
