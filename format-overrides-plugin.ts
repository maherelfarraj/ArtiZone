import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import type { Plugin, ViteDevServer } from 'vite'

import {
  EMPTY_FORMAT_OVERRIDE_BUNDLE,
  EMPTY_FORMAT_OVERRIDE_SIDECAR,
  type FormatOverrideBundle,
  type FormatOverrideSidecar,
} from './src/lib/format-overrides'

export const FORMAT_OVERRIDES_MODULE_ID = 'virtual:format-overrides'
const RESOLVED_MODULE_ID = '\0virtual:format-overrides'

function warnInvalidSidecar(scope: string): void {
  console.warn(JSON.stringify({
    event: 'format-overrides.sidecar.invalid',
    scope,
  }))
}

function isValidSidecar(value: unknown): value is FormatOverrideSidecar {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  return record.version === 1 && !!record.overrides && typeof record.overrides === 'object'
}

function readSidecarFromFile(filePath: string, scope: string): FormatOverrideSidecar {
  try {
    const raw = readFileSync(filePath, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (!isValidSidecar(parsed)) {
      warnInvalidSidecar(scope)
      return { ...EMPTY_FORMAT_OVERRIDE_SIDECAR }
    }
    return parsed
  } catch {
    warnInvalidSidecar(scope)
    return { ...EMPTY_FORMAT_OVERRIDE_SIDECAR }
  }
}

function collectScopes(root: string): FormatOverrideBundle['scopes'] {
  const overridesDir = join(root, 'format-overrides')
  if (!existsSync(overridesDir)) {
    return {}
  }

  const scopes: FormatOverrideBundle['scopes'] = {}
  const sharedPath = join(overridesDir, 'shared.json')
  if (existsSync(sharedPath)) {
    scopes.shared = readSidecarFromFile(sharedPath, 'shared')
  }

  const pagesDir = join(overridesDir, 'pages')
  if (!existsSync(pagesDir)) {
    return scopes
  }

  function walkPages(dir: string, prefix: string): void {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const entryPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        walkPages(entryPath, prefix ? `${prefix}/${entry.name}` : entry.name)
        continue
      }
      if (!entry.name.endsWith('.json')) continue
      const pageKey = entry.name.replace(/\.json$/, '')
      const scope = prefix ? `pages/${prefix}/${pageKey}` : `pages/${pageKey}`
      scopes[scope] = readSidecarFromFile(entryPath, scope)
    }
  }

  walkPages(pagesDir, '')
  return scopes
}

function buildBundle(root: string): FormatOverrideBundle {
  const scopes = collectScopes(root)
  if (Object.keys(scopes).length === 0) {
    return { ...EMPTY_FORMAT_OVERRIDE_BUNDLE }
  }
  return { version: 1, scopes }
}

function bundleToModule(bundle: FormatOverrideBundle): string {
  return `export default ${JSON.stringify(bundle)}`
}

export function formatOverridesPlugin(root: string): Plugin {
  let currentBundle = buildBundle(root)

  function refreshBundle(): FormatOverrideBundle {
    currentBundle = buildBundle(root)
    return currentBundle
  }

  return {
    name: 'format-overrides',
    resolveId(id) {
      if (id === FORMAT_OVERRIDES_MODULE_ID) {
        return RESOLVED_MODULE_ID
      }
      return undefined
    },
    async load(id) {
      if (id !== RESOLVED_MODULE_ID) return undefined
      return bundleToModule(currentBundle)
    },
    configureServer(server: ViteDevServer) {
      const overridesDir = join(root, 'format-overrides')
      server.watcher.add(overridesDir)

      const onSidecarChange = (filePath: string) => {
        const rel = relative(overridesDir, filePath).replace(/\\/g, '/')
        if (!rel.endsWith('.json')) return

        const bundle = refreshBundle()
        const moduleNode = server.moduleGraph.getModuleById(RESOLVED_MODULE_ID)
        if (moduleNode) {
          server.moduleGraph.invalidateModule(moduleNode)
        }
        server.ws.send('format-overrides:update', bundle)
      }

      server.watcher.on('change', onSidecarChange)
      server.watcher.on('add', onSidecarChange)
      server.watcher.on('unlink', onSidecarChange)
    },
  }
}
