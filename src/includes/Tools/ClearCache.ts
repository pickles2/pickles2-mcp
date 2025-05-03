import { Logger } from '../Logger/Logger.js';

/**
 * ClearCache
 */
export class ClearCache {
	px2proj: any;
	logger: Logger;

	/**
	 * コンストラクタ
	 * @param {any} px2proj - px2agentプロジェクトオブジェクト
	 * @param {Logger} logger - ロガー
	 */
	constructor(px2proj: any, logger: Logger) {
		this.px2proj = px2proj;
		this.logger = logger;
	}

	/**
	 * キャッシュを消去する
	 * 
	 * @returns {Promise<string>}
	 */
	async clearcache(): Promise<string> {
		const px2proj: any = this.px2proj;
		const logger: Logger = this.logger;

		return new Promise<string>((resolve: Function, reject: Function) => {
			px2proj.clearcache({
				"success": function(stdout: string){
					// console.log(stdout);
				},
				"complete":function(stdout: string){
					resolve(stdout);
				}
			});
		}).then((stdout) => {
			return stdout;
		});
	}
}