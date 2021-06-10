/* eslint-disable @typescript-eslint/no-var-requires */
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { $ } from 'zx'
import hasFlag from 'has-flag'

await $`npm run lint`

const betaScript = hasFlag('beta') ? '--prerelease beta' : ''
const dryRun = hasFlag('dry-run') ? '--dry-run' : ''

execSync(
  `pnpm -r --filter ./packages exec --\
    standard-version\
    --skip.commit=true\
    --skip.tag=true
    ${betaScript}\
    ${dryRun}`
)

const { version } = await fs.readJSON(
  path.resolve(__dirname, '../packages/vite-plugin-checker/package.json')
)

console.log(`✨ Going to release v${version}`)

await $`git add .`
await $`git commit -m "chore: release v${version}"`
await $`git tag v${version}`
await $`git push`

if (!hasFlag('skip-push')) {
  await $`git push origin --tags`
}
