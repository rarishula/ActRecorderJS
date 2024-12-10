// 共通ロジック

/**
 * 指定された日付を含む週の月曜日から日曜日の日付を計算
 * @param {string} dateStr - 基準となる日付（YYYY-MM-DD形式）
 * @returns {string[]} 週の月曜日から日曜日の日付の配列（YYYY-MM-DD形式）
 */
const getWeekRange = (dateStr) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7));
    return [...Array(7)].map((_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        return day.toISOString().split("T")[0];
    });
};

/**
 * ローカルストレージからデータを取得
 * @param {string} key - ローカルストレージのキー
 * @returns {Object} データオブジェクト
 */
const loadData = (key) => {
    return JSON.parse(localStorage.getItem(key)) || {};
};

/**
 * ローカルストレージにデータを保存
 * @param {string} key - ローカルストレージのキー
 * @param {Object} data - 保存するデータオブジェクト
 */
const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

/**
 * 時刻選択肢を生成
 * @param {string} selectId - 対象のセレクトボックスID
 */


// デバッグ用ログ（必要に応じて使用）
console.log("common.js loaded successfully.");
