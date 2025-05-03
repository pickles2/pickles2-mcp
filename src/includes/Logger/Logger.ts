import fs from 'fs';
import path from 'path';

/**
 * Loggerの初期化オプション
 */
export interface LoggerOptions {
    /**
     * ログ出力先のパス（指定がない場合はログ出力しない）
     */
    logPath?: string | null;
    
    /**
     * デバッグモードフラグ（falseの場合はログ出力しない）
     */
    debugMode?: boolean;
}

/**
 * Loggerクラス
 * 
 * ログ出力を管理するクラス
 */
export class Logger {
    private logPath: string | null;
    private debugMode: boolean;

    /**
     * コンストラクタ
     * @param {LoggerOptions} options - ロガーの初期化オプション
     */
    constructor(options: LoggerOptions = {}) {
        this.logPath = options.logPath ?? null;
        this.debugMode = options.debugMode ?? false;
    }

    /**
     * ログを出力する
     * @param {string} message - 出力するメッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    log(message: string): boolean {
        // ログパスが未設定またはデバッグモードが無効な場合は出力しない
        if (!this.logPath || !this.debugMode) {
            return false;
        }

        try {
            // 現在の日時を取得
            const now = new Date();
            const timestamp = now.toISOString();
            
            // 出力するログ行を作成
            const logLine = `[${timestamp}] ${message}\n`;
            
            // ディレクトリが存在することを確認
            const dirname = path.dirname(this.logPath);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true });
            }
            
            // ログファイルに追記
            fs.appendFileSync(this.logPath, logLine, 'utf8');
            return true;
        } catch (error) {
            console.error('ログの書き込みに失敗しました:', error);
            return false;
        }
    }

    /**
     * エラーログを出力する
     * @param {string|Error} error - 出力するエラーメッセージまたはErrorオブジェクト
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    error(error: string | Error): boolean {
        const errorMessage = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : error;
        return this.log(`[ERROR] ${errorMessage}`);
    }

    /**
     * 警告ログを出力する
     * @param {string} message - 出力する警告メッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    warn(message: string): boolean {
        return this.log(`[WARNING] ${message}`);
    }

    /**
     * 情報ログを出力する
     * @param {string} message - 出力する情報メッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    info(message: string): boolean {
        return this.log(`[INFO] ${message}`);
    }

    /**
     * デバッグログを出力する
     * @param {string} message - 出力するデバッグメッセージ
     * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
     */
    debug(message: string): boolean {
        return this.log(`[DEBUG] ${message}`);
    }

    /**
     * デバッグモードの設定を変更する
     * @param {boolean} mode - 新しいデバッグモードの値
     */
    setDebugMode(mode: boolean): void {
        this.debugMode = Boolean(mode);
    }

    /**
     * ログ出力先パスを設定する
     * @param {string|null} path - 新しいログ出力先パス
     */
    setLogPath(path: string | null): void {
        this.logPath = path;
    }
}