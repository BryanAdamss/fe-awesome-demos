'use strict'
const chalk = require('chalk') // chalk, 用于在控制台输出带颜色字体的插件
const semver = require('semver') // semver, 语义化版本检查插件（The semantic version parser used by npm）
const packageConfig = require('../package.json')
const shell = require('shelljs') // shelljs, 执行Unix命令行的插件

function exec(cmd) { // 开辟子进程执行指令cmd并返回结果
  return require('child_process').execSync(cmd).toString().trim()
}
// node和npm版本需求
const versionRequirements = [{
  name: 'node',
  currentVersion: semver.clean(process.version),
  versionRequirement: packageConfig.engines.node
}]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function() {
  const warnings = []
  // 依次判断版本是否符合要求
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }
  // 如果有警告则将其输出到控制台
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
