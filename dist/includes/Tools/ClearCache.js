/**
 * ClearCache
 */
export class ClearCache {
    px2proj;
    logger;
    /**
     * コンストラクタ
     * @param {any} px2proj - px2agentプロジェクトオブジェクト
     * @param {Logger} logger - ロガー
     */
    constructor(px2proj, logger) {
        this.px2proj = px2proj;
        this.logger = logger;
    }
    /**
     * キャッシュを消去する
     *
     * @returns {Promise<string>}
     */
    async clearcache() {
        const px2proj = this.px2proj;
        const logger = this.logger;
        return new Promise((resolve, reject) => {
            px2proj.clearcache({
                "success": function (stdout) {
                    // console.log(stdout);
                },
                "complete": function (stdout) {
                    resolve(stdout);
                }
            });
        }).then((stdout) => {
            return stdout;
        });
    }
}
