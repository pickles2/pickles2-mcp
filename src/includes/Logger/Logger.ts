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
	 * デバッグモードフラグ（falseの場合はDEBUGログを出力しない）
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
	 * @param {any} message - 出力するメッセージ（文字列、オブジェクト、配列など）
	 * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
	 */
	log(message: any): boolean {
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
			let formattedMessage: string;
			if (typeof message === 'string') {
				formattedMessage = message;
			} else {
				try {
					formattedMessage = JSON.stringify(message);
				} catch (jsonError) {
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
		} catch (error) {
			console.error('Failed to write log:', error);
			return false;
		}
	}

	/**
	 * エラーログを出力する
	 * @param {string|Error|any} error - 出力するエラーメッセージ、Errorオブジェクト、またはその他の値
	 * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
	 */
	error(error: string | Error | any): boolean {
		let errorMessage: string;
		if (error instanceof Error) {
			errorMessage = `${error.name}: ${error.message}\n${error.stack}`;
		} else if (typeof error === 'string') {
			errorMessage = error;
		} else {
			try {
				errorMessage = JSON.stringify(error);
			} catch (jsonError) {
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
	warn(message: any): boolean {
		return this.log(`[WARNING] ${message instanceof Object && !(message instanceof Error) ? JSON.stringify(message) : message}`);
	}

	/**
	 * 情報ログを出力する
	 * @param {any} message - 出力する情報メッセージ
	 * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
	 */
	info(message: any): boolean {
		return this.log(`[INFO] ${message instanceof Object && !(message instanceof Error) ? JSON.stringify(message) : message}`);
	}

	/**
	 * デバッグログを出力する
	 * @param {any} message - 出力するデバッグメッセージ
	 * @returns {boolean} - 成功した場合はtrue、失敗した場合はfalse
	 */
	debug(message: any): boolean {
		if (!this.debugMode) {
			return false;
		}
		return this.log(`[DEBUG] ${message instanceof Object && !(message instanceof Error) ? JSON.stringify(message) : message}`);
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