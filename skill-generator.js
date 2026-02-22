#!/usr/bin/env node

/**
 * Claude Code Skill Generator
 *
 * 用法:
 *   node skill-generator.js serve         - 启动本地服务器
 *   node skill-generator.js create        - 交互式创建 skill
 *   node skill-generator.js create -n xxx - 指定名称创建
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PORT = 3000;

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m'
};

function log(color, msg) {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

// 启动本地服务器
function startServer() {
    const server = http.createServer((req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
            const htmlPath = path.join(__dirname, 'skill-generator.html');
            fs.readFile(htmlPath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading page');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            });
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });

    server.listen(PORT, () => {
        log('cyan', '\n╔════════════════════════════════════════════╗');
        log('cyan', '║   Claude Code Skill Generator Server       ║');
        log('cyan', '╚════════════════════════════════════════════╝');
        log('green', `\n✓ 服务器已启动: http://localhost:${PORT}`);
        log('yellow', '\n按 Ctrl+C 停止服务器\n');
    });
}

// 交互式创建 skill
async function createSkillInteractive() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    log('cyan', '\n╔════════════════════════════════════════════╗');
    log('cyan', '║   Claude Code Skill Generator              ║');
    log('cyan', '╚════════════════════════════════════════════╝\n');

    try {
        const name = await question(`${colors.cyan}Skill 名称 (kebab-case): ${colors.reset}`);
        const title = await question(`${colors.cyan}Skill 标题: ${colors.reset}`) || name;
        const description = await question(`${colors.cyan}Skill 描述: ${colors.reset}`);

        log('yellow', '\n输入触发短语 (每行一个，输入空行结束):');
        const triggers = [];
        let trigger;
        while ((trigger = await question('  > ')) !== '') {
            triggers.push(trigger);
        }

        log('yellow', '\n输入 Skill 内容/指令 (输入 END 结束):');
        const contentLines = [];
        let line;
        while ((line = await question('')) !== 'END') {
            contentLines.push(line);
        }
        const content = contentLines.join('\n');

        const userInvocable = (await question(`\n${colors.cyan}用户可调用? (Y/n): ${colors.reset}`)).toLowerCase() !== 'n';
        const format = (await question(`${colors.cyan}输出格式 (md/json) [md]: ${colors.reset}`)) || 'md';

        // 生成文件内容
        let output;
        if (format === 'json') {
            output = JSON.stringify({
                name,
                title,
                description,
                triggers,
                userInvocable,
                content
            }, null, 2);
        } else {
            output = `---
name: ${name}
title: ${title}
userInvocable: ${userInvocable}
---

# ${title}

${description}

## 触发条件

当用户使用以下短语时触发此 skill：
${triggers.map(t => `- "${t}"`).join('\n')}

## 指令

${content}
`;
        }

        // 保存文件
        const filename = `${name}.${format === 'json' ? 'json' : 'md'}`;
        const outputDir = path.join(__dirname, 'skills');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filepath = path.join(outputDir, filename);
        fs.writeFileSync(filepath, output);

        log('green', `\n✓ Skill 文件已生成: ${filepath}`);
        console.log('\n--- 文件内容 ---\n');
        console.log(output);
        console.log('\n--- 结束 ---\n');

    } finally {
        rl.close();
    }
}

// 快速创建 skill (带参数)
function createSkillQuick(args) {
    const nameIdx = args.indexOf('-n');
    if (nameIdx === -1 || !args[nameIdx + 1]) {
        log('yellow', '用法: node skill-generator.js create -n <skill-name>');
        return;
    }

    const name = args[nameIdx + 1];
    const template = `---
name: ${name}
title: ${name}
userInvocable: true
---

# ${name}

在此描述 skill 的用途...

## 触发条件

当用户使用以下短语时触发此 skill：
- "触发短语1"
- "触发短语2"

## 指令

在此编写详细的指令内容...
`;

    const outputDir = path.join(__dirname, 'skills');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filepath = path.join(outputDir, `${name}.md`);
    fs.writeFileSync(filepath, template);
    log('green', `\n✓ Skill 模板已生成: ${filepath}`);
}

// 显示帮助
function showHelp() {
    console.log(`
${colors.cyan}Claude Code Skill Generator${colors.reset}

用法:
  node skill-generator.js <command> [options]

命令:
  ${colors.green}serve${colors.reset}              启动本地 Web 服务器 (http://localhost:${PORT})
  ${colors.green}create${colors.reset}             交互式创建 skill 文件
  ${colors.green}create -n <name>${colors.reset}   快速创建 skill 模板
  ${colors.green}help${colors.reset}               显示此帮助信息

示例:
  node skill-generator.js serve
  node skill-generator.js create
  node skill-generator.js create -n my-awesome-skill
`);
}

// 主程序
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'serve':
        startServer();
        break;
    case 'create':
        if (args.includes('-n')) {
            createSkillQuick(args);
        } else {
            createSkillInteractive();
        }
        break;
    case 'help':
    case '--help':
    case '-h':
        showHelp();
        break;
    default:
        showHelp();
}
