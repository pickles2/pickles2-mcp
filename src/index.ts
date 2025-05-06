#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { px2agent } from 'px2agent';
import { Command } from 'commander';
import { Logger } from './includes/Logger/Logger.js';

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

		// Add Pickles 2 get-version tool
		server.tool(
			"pickles2-get-version",
			"Get Pickles 2 version.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-version');
				logger.debug(parameters);
				const version = await px2proj.get_version();
				logger.debug(version);
				logger.info('Run command: pickles2-get-version; done');
				return {
					content: [{
						type: "text",
						text: version,
					}]
				};
			}
		);

		// Add Pickles 2 get-config tool
		server.tool(
			"pickles2-get-config",
			"Get Pickles 2 config.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-config');
				logger.debug(parameters);
				const config = await px2proj.get_config();
				const result = JSON.stringify(config);
				logger.debug(result);
				logger.info('Run command: pickles2-get-config; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-sitemap tool
		server.tool(
			"pickles2-get-sitemap",
			"Get Pickles 2 sitemap.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-sitemap');
				logger.debug(parameters);
				const sitemap = await px2proj.get_sitemap();
				const result = JSON.stringify(sitemap);
				logger.debug(result);
				logger.info('Run command: pickles2-get-sitemap; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-page-info tool
		server.tool(
			"pickles2-get-page-info",
			"Get page information.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-page-info');
				logger.debug(parameters);
				const pageInfo = await px2proj.get_page_info(parameters.path);
				const result = JSON.stringify(pageInfo);
				logger.debug(result);
				logger.info('Run command: pickles2-get-page-info; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-parent tool
		server.tool(
			"pickles2-get-parent",
			"Get parent page.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-parent');
				logger.debug(parameters);
				const parent = await px2proj.get_parent(parameters.path);
				const result = JSON.stringify(parent);
				logger.debug(result);
				logger.info('Run command: pickles2-get-parent; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-children tool
		server.tool(
			"pickles2-get-children",
			"Get child pages.",
			{
				path: z.string().describe("Page path"),
				options: z.record(z.any()).optional().describe("Options for getting children")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-children');
				logger.debug(parameters);
				const children = await px2proj.get_children(parameters.path, parameters.options);
				const result = JSON.stringify(children);
				logger.debug(result);
				logger.info('Run command: pickles2-get-children; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-bros tool
		server.tool(
			"pickles2-get-bros",
			"Get sibling pages.",
			{
				path: z.string().describe("Page path"),
				options: z.record(z.any()).optional().describe("Options for getting brothers")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-bros');
				logger.debug(parameters);
				const bros = await px2proj.get_bros(parameters.path, parameters.options);
				const result = JSON.stringify(bros);
				logger.debug(result);
				logger.info('Run command: pickles2-get-bros; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-bros-next tool
		server.tool(
			"pickles2-get-bros-next",
			"Get next sibling page.",
			{
				path: z.string().describe("Page path"),
				options: z.record(z.any()).optional().describe("Options for getting next brother")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-bros-next');
				logger.debug(parameters);
				const brosNext = await px2proj.get_bros_next(parameters.path, parameters.options);
				const result = JSON.stringify(brosNext);
				logger.debug(result);
				logger.info('Run command: pickles2-get-bros-next; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-bros-prev tool
		server.tool(
			"pickles2-get-bros-prev",
			"Get previous sibling page.",
			{
				path: z.string().describe("Page path"),
				options: z.record(z.any()).optional().describe("Options for getting previous brother")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-bros-prev');
				logger.debug(parameters);
				const brosPrev = await px2proj.get_bros_prev(parameters.path, parameters.options);
				const result = JSON.stringify(brosPrev);
				logger.debug(result);
				logger.info('Run command: pickles2-get-bros-prev; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-next tool
		server.tool(
			"pickles2-get-next",
			"Get next page.",
			{
				path: z.string().describe("Page path"),
				options: z.record(z.any()).optional().describe("Options for getting next page")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-next');
				logger.debug(parameters);
				const next = await px2proj.get_next(parameters.path, parameters.options);
				const result = JSON.stringify(next);
				logger.debug(result);
				logger.info('Run command: pickles2-get-next; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-prev tool
		server.tool(
			"pickles2-get-prev",
			"Get previous page.",
			{
				path: z.string().describe("Page path"),
				options: z.record(z.any()).optional().describe("Options for getting previous page")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-prev');
				logger.debug(parameters);
				const prev = await px2proj.get_prev(parameters.path, parameters.options);
				const result = JSON.stringify(prev);
				logger.debug(result);
				logger.info('Run command: pickles2-get-prev; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-breadcrumb-array tool
		server.tool(
			"pickles2-get-breadcrumb-array",
			"Get breadcrumb array.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-breadcrumb-array');
				logger.debug(parameters);
				const breadcrumb = await px2proj.get_breadcrumb_array(parameters.path);
				const result = JSON.stringify(breadcrumb);
				logger.debug(result);
				logger.info('Run command: pickles2-get-breadcrumb-array; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-dynamic-path-info tool
		server.tool(
			"pickles2-get-dynamic-path-info",
			"Get dynamic path information.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-dynamic-path-info');
				logger.debug(parameters);
				const dynamicPathInfo = await px2proj.get_dynamic_path_info(parameters.path);
				const result = JSON.stringify(dynamicPathInfo);
				logger.debug(result);
				logger.info('Run command: pickles2-get-dynamic-path-info; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 bind-dynamic-path-param tool
		server.tool(
			"pickles2-bind-dynamic-path-param",
			"Bind dynamic path parameters.",
			{
				path: z.string().describe("Page path"),
				params: z.record(z.string()).describe("Parameters to bind to the dynamic path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-bind-dynamic-path-param');
				logger.debug(parameters);
				const boundPath = await px2proj.bind_dynamic_path_param(parameters.path, parameters.params);
				logger.debug(boundPath);
				logger.info('Run command: pickles2-bind-dynamic-path-param; done');
				return {
					content: [{
						type: "text",
						text: boundPath,
					}]
				};
			}
		);

		// Add Pickles 2 get-role tool
		server.tool(
			"pickles2-get-role",
			"Get role.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-role');
				logger.debug(parameters);
				const role = await px2proj.get_role(parameters.path);
				logger.debug(role);
				logger.info('Run command: pickles2-get-role; done');
				return {
					content: [{
						type: "text",
						text: role,
					}]
				};
			}
		);

		// Add Pickles 2 get-actors tool
		server.tool(
			"pickles2-get-actors",
			"Get actors.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-actors');
				logger.debug(parameters);
				const actors = await px2proj.get_actors(parameters.path);
				const result = JSON.stringify(actors);
				logger.debug(result);
				logger.info('Run command: pickles2-get-actors; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-realpath-homedir tool
		server.tool(
			"pickles2-get-realpath-homedir",
			"Get home directory path.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-realpath-homedir');
				logger.debug(parameters);
				const homedir = await px2proj.get_realpath_homedir();
				logger.debug(homedir);
				logger.info('Run command: pickles2-get-realpath-homedir; done');
				return {
					content: [{
						type: "text",
						text: homedir,
					}]
				};
			}
		);

		// Add Pickles 2 get-path-controot tool
		server.tool(
			"pickles2-get-path-controot",
			"Get content root directory path.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-path-controot');
				logger.debug(parameters);
				const controot = await px2proj.get_path_controot();
				logger.debug(controot);
				logger.info('Run command: pickles2-get-path-controot; done');
				return {
					content: [{
						type: "text",
						text: controot,
					}]
				};
			}
		);

		// Add Pickles 2 get-realpath-docroot tool
		server.tool(
			"pickles2-get-realpath-docroot",
			"Get DOCUMENT_ROOT path.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-realpath-docroot');
				logger.debug(parameters);
				const docroot = await px2proj.get_realpath_docroot();
				logger.debug(docroot);
				logger.info('Run command: pickles2-get-realpath-docroot; done');
				return {
					content: [{
						type: "text",
						text: docroot,
					}]
				};
			}
		);

		// Add Pickles 2 get-path-content tool
		server.tool(
			"pickles2-get-path-content",
			"Get content path.",
			{
				path: z.string().describe("Page path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-path-content');
				logger.debug(parameters);
				const contentPath = await px2proj.get_path_content(parameters.path);
				logger.debug(contentPath);
				logger.info('Run command: pickles2-get-path-content; done');
				return {
					content: [{
						type: "text",
						text: contentPath,
					}]
				};
			}
		);

		// Add Pickles 2 path-files tool
		server.tool(
			"pickles2-path-files",
			"Get local resource directory path.",
			{
				path: z.string().describe("Page path"),
				resource: z.string().optional().describe("Resource path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-path-files');
				logger.debug(parameters);
				const filesPath = await px2proj.path_files(parameters.path, parameters.resource);
				logger.debug(filesPath);
				logger.info('Run command: pickles2-path-files; done');
				return {
					content: [{
						type: "text",
						text: filesPath,
					}]
				};
			}
		);

		// Add Pickles 2 realpath-files tool
		server.tool(
			"pickles2-realpath-files",
			"Get local resource directory server path.",
			{
				path: z.string().describe("Page path"),
				resource: z.string().optional().describe("Resource path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-realpath-files');
				logger.debug(parameters);
				const realpathFiles = await px2proj.realpath_files(parameters.path, parameters.resource);
				logger.debug(realpathFiles);
				logger.info('Run command: pickles2-realpath-files; done');
				return {
					content: [{
						type: "text",
						text: realpathFiles,
					}]
				};
			}
		);

		// Add Pickles 2 path-files-cache tool
		server.tool(
			"pickles2-path-files-cache",
			"Get local resource cache directory path.",
			{
				path: z.string().describe("Page path"),
				resource: z.string().optional().describe("Resource path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-path-files-cache');
				logger.debug(parameters);
				const cacheFilesPath = await px2proj.path_files_cache(parameters.path, parameters.resource);
				logger.debug(cacheFilesPath);
				logger.info('Run command: pickles2-path-files-cache; done');
				return {
					content: [{
						type: "text",
						text: cacheFilesPath,
					}]
				};
			}
		);

		// Add Pickles 2 realpath-files-cache tool
		server.tool(
			"pickles2-realpath-files-cache",
			"Get local resource cache directory server path.",
			{
				path: z.string().describe("Page path"),
				resource: z.string().optional().describe("Resource path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-realpath-files-cache');
				logger.debug(parameters);
				const realpathFilesCache = await px2proj.realpath_files_cache(parameters.path, parameters.resource);
				logger.debug(realpathFilesCache);
				logger.info('Run command: pickles2-realpath-files-cache; done');
				return {
					content: [{
						type: "text",
						text: realpathFilesCache,
					}]
				};
			}
		);

		// Add Pickles 2 realpath-files-private-cache tool
		server.tool(
			"pickles2-realpath-files-private-cache",
			"Get content-specific private cache directory server path.",
			{
				path: z.string().describe("Page path"),
				resource: z.string().optional().describe("Resource path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-realpath-files-private-cache');
				logger.debug(parameters);
				const privateCache = await px2proj.realpath_files_private_cache(parameters.path, parameters.resource);
				logger.debug(privateCache);
				logger.info('Run command: pickles2-realpath-files-private-cache; done');
				return {
					content: [{
						type: "text",
						text: privateCache,
					}]
				};
			}
		);

		// Add Pickles 2 get-domain tool
		server.tool(
			"pickles2-get-domain",
			"Get domain.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-domain');
				logger.debug(parameters);
				const domain = await px2proj.get_domain();
				logger.debug(domain);
				logger.info('Run command: pickles2-get-domain; done');
				return {
					content: [{
						type: "text",
						text: domain,
					}]
				};
			}
		);

		// Add Pickles 2 get-directory-index tool
		server.tool(
			"pickles2-get-directory-index",
			"Get directory index list.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-directory-index');
				logger.debug(parameters);
				const dirIndex = await px2proj.get_directory_index();
				const result = JSON.stringify(dirIndex);
				logger.debug(result);
				logger.info('Run command: pickles2-get-directory-index; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 get-directory-index-primary tool
		server.tool(
			"pickles2-get-directory-index-primary",
			"Get primary directory index.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-get-directory-index-primary');
				logger.debug(parameters);
				const primaryDirIndex = await px2proj.get_directory_index_primary();
				logger.debug(primaryDirIndex);
				logger.info('Run command: pickles2-get-directory-index-primary; done');
				return {
					content: [{
						type: "text",
						text: primaryDirIndex,
					}]
				};
			}
		);

		// Add Pickles 2 get-path-proc-type tool
		server.tool(
			"pickles2-get-path-proc-type",
			"Get path processing type.",
			{
				path: z.string().describe("File path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-get-path-proc-type');
				logger.debug(parameters);
				const procType = await px2proj.get_path_proc_type(parameters.path);
				logger.debug(procType);
				logger.info('Run command: pickles2-get-path-proc-type; done');
				return {
					content: [{
						type: "text",
						text: procType,
					}]
				};
			}
		);

		// Add Pickles 2 href tool
		server.tool(
			"pickles2-href",
			"Generate link path.",
			{
				path: z.string().describe("Link to path")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-href');
				logger.debug(parameters);
				const href = await px2proj.href(parameters.path);
				logger.debug(href);
				logger.info('Run command: pickles2-href; done');
				return {
					content: [{
						type: "text",
						text: href,
					}]
				};
			}
		);

		// Add Pickles 2 is-match-dynamic-path tool
		server.tool(
			"pickles2-is-match-dynamic-path",
			"Check if path matches dynamic path.",
			{
				path: z.string().describe("Path to check")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-is-match-dynamic-path');
				logger.debug(parameters);
				const isMatch = await px2proj.is_match_dynamic_path(parameters.path);
				const result = isMatch.toString();
				logger.debug(result);
				logger.info('Run command: pickles2-is-match-dynamic-path; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 is-page-in-breadcrumb tool
		server.tool(
			"pickles2-is-page-in-breadcrumb",
			"Check if page exists in breadcrumb.",
			{
				path: z.string().describe("Page path"),
				path_in: z.string().describe("Path to check in breadcrumb")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-is-page-in-breadcrumb');
				logger.debug(parameters);
				const isInBreadcrumb = await px2proj.is_page_in_breadcrumb(parameters.path, parameters.path_in);
				const result = isInBreadcrumb.toString();
				logger.debug(result);
				logger.info('Run command: pickles2-is-page-in-breadcrumb; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 is-ignore-path tool
		server.tool(
			"pickles2-is-ignore-path",
			"Check if path is ignore path.",
			{
				path: z.string().describe("Path to check")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-is-ignore-path');
				logger.debug(parameters);
				const isIgnore = await px2proj.is_ignore_path(parameters.path);
				const result = isIgnore.toString();
				logger.debug(result);
				logger.info('Run command: pickles2-is-ignore-path; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Add Pickles 2 publish tool
		server.tool(
			"pickles2-publish",
			"Publish Pickles 2 project.",
			{
				options: z.object({
					path_region: z.string().optional().describe("Path region to publish"),
					paths_region: z.array(z.string()).optional().describe("Path regions to publish"),
					paths_ignore: z.array(z.string()).optional().describe("Paths to ignore"),
					keep_cache: z.boolean().optional().describe("Keep cache")
				}).optional().describe("Publish options")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-publish');
				logger.debug(parameters);
				const publishResult = await px2proj.publish(parameters?.options);
				logger.debug(publishResult);
				logger.info('Run command: pickles2-publish; done');
				return {
					content: [{
						type: "text",
						text: publishResult,
					}]
				};
			}
		);

		// Add Pickles 2 clearcache tool
		server.tool(
			"pickles2-clearcache",
			"Clear the Pickles 2 cache.",
			{},
			async (parameters) => {
				logger.info('Run command: pickles2-clearcache');
				logger.debug(parameters);
				const stdout = await px2proj.clearcache();
				logger.debug(stdout);
				logger.info('Run command: pickles2-clearcache; done');
				return {
					content: [{
						type: "text",
						text: stdout,
					}]
				};
			}
		);

		// Add Pickles 2 query tool
		server.tool(
			"pickles2-query",
			"Execute a custom query to Pickles 2.",
			{
				path: z.string().describe("Query path"),
				options: z.object({
					method: z.string().optional().describe("HTTP method"),
					body: z.string().optional().describe("Request body"),
					bodyFile: z.string().optional().describe("Path to request body file")
				}).optional().describe("Query options")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-query');
				logger.debug(parameters);
				const queryResult = await px2proj.query(parameters.path, parameters.options);
				logger.debug(queryResult);
				logger.info('Run command: pickles2-query; done');
				return {
					content: [{
						type: "text",
						text: queryResult,
					}]
				};
			}
		);

		// Add Pickles 2 px-command tool
		server.tool(
			"pickles2-px-command",
			"Execute a PX command.",
			{
				command: z.string().describe("PX command"),
				path: z.string().optional().describe("Path"),
				params: z.record(z.string()).optional().describe("Command parameters")
			},
			async (parameters) => {
				logger.info('Run command: pickles2-px-command');
				logger.debug(parameters);
				const cmdResult = await px2proj.px_command(parameters.command, parameters.path, parameters.params);
				const result = JSON.stringify(cmdResult);
				logger.debug(result);
				logger.info('Run command: pickles2-px-command; done');
				return {
					content: [{
						type: "text",
						text: result,
					}]
				};
			}
		);

		// Start receiving messages on stdin and sending messages on stdout
		const transport = new StdioServerTransport();
		await server.connect(transport);
	});

program.parse(process.argv);
