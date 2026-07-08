import fs from 'fs'
import path from 'path'

const componentsThemeDir = path.join(process.cwd(), 'src/components/theme')
const layoutsDir = path.join(componentsThemeDir, 'layouts')
const colorsDir = path.join(componentsThemeDir, 'colors')
const registryFile = path.join(componentsThemeDir, 'registry.ts')

function getFiles(dir: string) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.ts'))
    .map(f => f.replace('.ts', ''))
}

const layouts = getFiles(layoutsDir)
const colors = getFiles(colorsDir)

let registryContent = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Run 'npm run theme:generate' to update this file.

`

// Import all layouts
layouts.forEach(name => {
  const camelName = name.replace(/-([a-z])/g, g => g[1].toUpperCase())
  registryContent += `import ${camelName}Layout from './layouts/${name}'\n`
})

// Import all colors
colors.forEach(name => {
  const camelName = name.replace(/-([a-z])/g, g => g[1].toUpperCase())
  registryContent += `import ${camelName}Color from './colors/${name}'\n`
})

registryContent += `\nexport const LAYOUTS = {\n`
layouts.forEach(name => {
  const camelName = name.replace(/-([a-z])/g, g => g[1].toUpperCase())
  registryContent += `  '${name}': ${camelName}Layout,\n`
})
registryContent += `} as const;\n\n`

registryContent += `export const COLORS = {\n`
colors.forEach(name => {
  const camelName = name.replace(/-([a-z])/g, g => g[1].toUpperCase())
  registryContent += `  '${name}': ${camelName}Color,\n`
})
registryContent += `} as const;\n\n`

registryContent += `export const AVAILABLE_LAYOUTS = Object.keys(LAYOUTS) as Array<keyof typeof LAYOUTS>;\n`
registryContent += `export const AVAILABLE_COLORS = Object.keys(COLORS) as Array<keyof typeof COLORS>;\n`

fs.writeFileSync(registryFile, registryContent)
console.log('Successfully generated theme registry!')
