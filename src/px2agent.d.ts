declare module 'px2agent' {
    export interface Px2Project {
        clearcache(options: {
            success?: (stdout: string) => void;
            complete?: (stdout: string) => void;
        }): void;
        // その他のpx2agentメソッドもここに定義できます
    }

    export function createProject(entryScript: string): Px2Project;
    
    // デフォルトエクスポート
    export default {
        createProject
    };
}