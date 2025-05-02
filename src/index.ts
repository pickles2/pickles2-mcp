import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
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

		// Add an addition tool
		server.tool("add",
			{ a: z.number(), b: z.number() },
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }]
			})
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
