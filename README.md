# pickles2-mcp

`pickles2-mcp` は、 AIエージェントから <a href="https://pickles2.com/" target="_blank">Pickles 2</a> を操作するためのMCPサーバー機能を提供します。

## インストール - Installation

```json
{
    "mcpServers": {
		"Pickles 2 MCP": {
			"type": "stdio",
			"command": "npx",
			"args": [
                "pickles2-mcp"
				"--entry-script", "/path_to_your/src_px2/.px_execute.php"
			]
		}
    }
}
```


## 更新履歴 - Change log

### pickles2-mcp v0.1.0 (2025年5月6日)

- Initial release.


## ライセンス - License

MIT License https://opensource.org/licenses/mit-license.php


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
