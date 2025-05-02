import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import px2agent from 'px2agent';
import { Command } from 'commander';

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
	.option('-d, --debug', 'output extra debugging')
	.requiredOption('--entry-script <path>', '[required] entry script for the Pickles 2.')
	.action(async (cliOptions) => {
		const px2proj = px2agent.createProject(cliOptions.entryScript);

		// Add an addition tool
		server.tool("clearcache",
			"Clear the Pickles 2 cache.",
			async () => {
				// Clear the cache
				return new Promise((resolve: Function, reject: Function) => {
					px2proj.clearcache({
						"success": function(stdout: string){
							// console.log(stdout);
						},
						"complete":function(stdout: string){
							resolve(stdout);
						}
					});
				}).then((stdout) => {
					return {
						content: [{
							type: "text",
							text: "Cache cleared." + stdout,
						}]
					};
				});
			}
		);

		// Add a dynamic greeting resource
		server.resource(
			"greeting",
			new ResourceTemplate("greeting://{name}", { list: undefined }),
			async (uri, { name }) => ({
				contents: [{
					uri: uri.href,
					text: `Hello, ${name}!`
				}]
			})
		);

		// Start receiving messages on stdin and sending messages on stdout
		const transport = new StdioServerTransport();
		await server.connect(transport);
	});

program.parse(process.argv);
