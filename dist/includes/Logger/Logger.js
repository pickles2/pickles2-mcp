import fs from 'fs';
import path from 'path';
/**
 * Loggerクラス
 *
 * ログ出力を管理するクラス
 */
export class Logger {
    logPath;
    debugMode;
    /**
     * コンストラクタ
     * @param {LoggerOptions} options - ロガーの初期化オプション
     */
    constructor(options = {}) {
        this.logPath = options.logPath ?? null;
        this.debugMode = options.debugMode ?? false;
    }
    /**
     * ログを出力する
     * @param {any} message - 出力するメッセージ（文字列、オブジェクト、配列など）
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    log(message) {
        // ログパスが未設定またはデバッグモードが無効な場合は出力しない
        if (!this.logPath) {
            return false;
        }
        try {
            // 現在の日時を取得
            const now = new Date();
            const timestamp = now.toISOString();
            // プロセスIDを取得
            const pid = process.pid;
            // メッセージをフォーマット
            let formattedMessage;
            if (typeof message === 'string') {
                formattedMessage = message;
            }
            else {
                try {
                    formattedMessage = JSON.stringify(message);
                }
                catch (jsonError) {
                    formattedMessage = String(message);
                }
            }
            // 出力するログ行を作成
            const logLine = `[${timestamp}] [PID:${pid}] ${formattedMessage}\n`;
            // ディレクトリが存在することを確認
            const dirname = path.dirname(this.logPath);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true });
            }
            // ログファイルに追記
            fs.appendFileSync(this.logPath, logLine, 'utf8');
            return true;
        }
        catch (error) {
            console.error('Failed to write log:', error);
            return false;
        }
    }
    /**
     * エラーログを出力する
     * @param {string|Error|any} error - 出力するエラーメッセージ、Errorオブジェクト、またはその他の値
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    error(error) {
        let errorMessage;
        if (error instanceof Error) {
            errorMessage = `${error.name}: ${error.message}\n${error.stack}`;
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        else {
            try {
                errorMessage = JSON.stringify(error);
            }
            catch (jsonError) {
                errorMessage = String(error);
            }
        }
        return this.log(`[ERROR] ${errorMessage}`);
    }
    /**
     * 警告ログを出力する
     * @param {any} message - 出力する警告メッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    warn(message) {
        return this.log(`[WARNING] ${message instanceof Object && !(message instanceof Error) ? JSON.stringify(message) : message}`);
    }
    /**
     * 情報ログを出力する
     * @param {any} message - 出力する情報メッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    info(message) {
        return this.log(`[INFO] ${message instanceof Object && !(message instanceof Error) ? JSON.stringify(message) : message}`);
    }
    /**
     * デバッグログを出力する
     * @param {any} message - 出力するデバッグメッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    debug(message) {
        if (!this.debugMode) {
            return false;
        }
        return this.log(`[DEBUG] ${message instanceof Object && !(message instanceof Error) ? JSON.stringify(message) : message}`);
    }
    /**
     * デバッグモードの設定を変更する
     * @param {boolean} mode - 新しいデバッグモードの値
     */
    setDebugMode(mode) {
        this.debugMode = Boolean(mode);
    }
    /**
     * ログ出力先パスを設定する
     * @param {string|null} path - 新しいログ出力先パス
     */
    setLogPath(path) {
        this.logPath = path;
    }
}
