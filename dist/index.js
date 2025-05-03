#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import px2agent from 'px2agent';
import { Command } from 'commander';
import { Logger } from './includes/Logger/Logger.js';
import { ClearCache } from './includes/Tools/ClearCache.js';
const version = "0.1.0";
const program = new Command();
// Create an MCP server
const server = new McpServer({
    name: "Pickles 2 MCP",
    version: version,
});
program
    .version(version)
    .description('A MCP server for Pickles 2')
    .requiredOption('--entry-script <path>', '[Required] Entry script for the Pickles 2.')
    .option('-d, --debug', 'output extra debugging')
    .option('--log-path <path>', 'Log output path.')
    .action(async (cliOptions) => {
    const px2proj = px2agent.createProject(cliOptions.entryScript);
    const logger = new Logger({
        debugMode: cliOptions.debug,
        logPath: cliOptions.logPath,
    });
    logger.info('===== Pickles 2 MCP server started =====');
    logger.info('Entry script: ' + cliOptions.entryScript);
    logger.info('Debug mode: ' + cliOptions.debug);
    logger.info('Log path: ' + cliOptions.logPath);
    logger.info(cliOptions);
    // Add an addition tool
    server.tool("pickles2-clearcache", "Clear the Pickles 2 cache.", async (extra) => {
        // Clear the cache
        logger.info('Run command: ' + "pickles2-clearcache");
        logger.info(extra);
        const clearCache = new ClearCache(px2proj, logger);
        const stdout = await clearCache.clearcache();
        logger.info('Run command: ' + "pickles2-clearcache; " + "done");
        return {
            content: [{
                    type: "text",
                    text: "Cache cleared." + "\n\n" + stdout,
                }]
        };
    });
    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
});
program.parse(process.argv);
