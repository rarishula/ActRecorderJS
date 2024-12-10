const dataKey = "actionData";

// 簡易カレンダーの生成
const renderSimpleCalendar = (data, week) => {
    const container = document.getElementById("simple-calendar");
    container.innerHTML = "";

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    // ヘッダーに週の日付を表示
    headerRow.innerHTML = `<th>時間</th>${week.map(date => `<th>${date}</th>`).join("")}`;
    table.appendChild(headerRow);

    for (let hour = 0; hour < 24; hour++) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${hour}:00</td>${week.map(date => {
            const cellData = data[date]?.[`${hour}:00`] || {};
            const genre = cellData.ジャンル || "";
            const color = getGenreColor(genre);
            return `<td class="color-cell" style="background-color: ${color};">${genre}</td>`;
        }).join("")}`;
        table.appendChild(row);
    }

    container.appendChild(table);
};

// 詳細カレンダーの生成
const renderDetailedCalendar = (data, week) => {
    const container = document.getElementById("detailed-calendar");
    container.innerHTML = "";

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    headerRow.innerHTML = `<th>時間</th>${week.map(date => `
        <th>${date}-詳細</th>
        <th>${date}-理由</th>
        <th>${date}-結果</th>`).join("")}`;
    table.appendChild(headerRow);

    for (let hour = 0; hour < 24; hour++) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${hour}:00</td>${week.map(date => {
            const cellData = data[date]?.[`${hour}:00`] || {};
            return `
                <td>${cellData.詳細 || ""}</td>
                <td>${cellData.理由 || ""}</td>
                <td>${cellData.結果 || ""}</td>`;
        }).join("")}`;
        table.appendChild(row);
    }

    container.appendChild(table);
};

// 日付変更時のカレンダー更新
document.getElementById("date-input").addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    const week = getWeekRange(selectedDate); // common.jsの関数を利用
    const data = loadData(dataKey); // common.jsの関数を利用
    renderSimpleCalendar(data, week);
    renderDetailedCalendar(data, week);
});

// ジャンルに応じた色を取得
const getGenreColor = (genre) => {
    const colors = {
        "仕事": "#FFD700",
        "勉強": "#87CEEB",
        "遊び": "#98FB98",
        "運動": "#FFA500",
        "その他": "#D3D3D3"
    };
    return colors[genre] || "#FFFFFF";
};

// 1時間ごとの時刻選択肢を生成（main_calendar専用）
const generateHourlyTimeOptionsForMain = (selectId) => {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = ""; // 既存の選択肢をクリア
    const options = [...Array(24)].map((_, i) => `${i.toString().padStart(2, "0")}:00`);

    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option; // HH:00形式
        opt.textContent = option; // 表示テキスト
        select.appendChild(opt);
    });
};

document.getElementById("save-button").addEventListener("click", () => {
    const date = document.getElementById("date-input").value;
    let hour = document.getElementById("hour-input").value;
    const genre = document.getElementById("genre-input").value;
    const detail = document.getElementById("detail-input").value;
    const reason = document.getElementById("reason-input").value;
    const result = document.getElementById("result-input").value;

    const data = loadData(dataKey); // ローカルストレージからデータを取得

    // 時間形式を修正（先頭の0を削除して統一）
    hour = hour.replace(/^0/, "");

    if (!data[date]) {
        data[date] = {};
    }
    data[date][hour] = { ジャンル: genre, 詳細: detail, 理由: reason, 結果: result };

    saveData(dataKey, data); // ローカルストレージにデータを保存

    // カレンダーを再レンダリング
    const week = getWeekRange(date);
    renderSimpleCalendar(data, week);
    renderDetailedCalendar(data, week);
});


// 初期化
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date-input").value = today; // 初期値として今日の日付を設定

    generateHourlyTimeOptionsForMain("hour-input"); // main_calendar専用プルダウン生成

    const week = getWeekRange(today); // 今日を含む週を取得
    const data = loadData(dataKey); // データを取得
    renderSimpleCalendar(data, week); // 簡易カレンダーをレンダリング
    renderDetailedCalendar(data, week); // 詳細カレンダーをレンダリング
});

// 入力フォームの初期値を設定
const setFormDefaults = () => {
    const date = document.getElementById("date-input").value;
    const hour = document.getElementById("hour-input").value.replace(/^0/, ""); // 時間形式を統一
    const data = loadData(dataKey);

    const action = data[date]?.[hour] || {};

    // 各フォームに初期値を設定
    document.getElementById("genre-input").value = action.ジャンル || "";
    document.getElementById("detail-input").value = action.詳細 || "";
    document.getElementById("reason-input").value = action.理由 || "";
    document.getElementById("result-input").value = action.結果 || "";
};

// 日付または時刻が変更された際に初期値を設定
document.getElementById("date-input").addEventListener("change", setFormDefaults);
document.getElementById("hour-input").addEventListener("change", setFormDefaults);

// 初期化時にフォームの初期値を設定
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date-input").value = today;

    // 初期化時の時刻は最初の選択肢（例: "0:00"）
    document.getElementById("hour-input").value = "0:00";

    generateHourlyTimeOptionsForMain("hour-input"); // 時刻選択肢を生成
    setFormDefaults(); // フォームの初期値を設定
});
