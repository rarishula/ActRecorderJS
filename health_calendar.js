const healthDataKey = "healthData";

// 健康カレンダーの生成
const renderHealthCalendar = (data, week) => {
    const container = document.getElementById("health-calendar");
    container.innerHTML = "";

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    headerRow.innerHTML = `<th>項目</th>${week.map(date => `<th>${date}</th>`).join("")}`;
    table.appendChild(headerRow);

    const rows = [
        { label: "朝食", key: "朝食" },
        { label: "昼食", key: "昼食" },
        { label: "夕食", key: "夕食" },
        { label: "投薬時刻", key: "投薬時刻" },
        { label: "投薬種類", key: "投薬種類" },
        { label: "健康(肉体)", key: "肉体" },
        { label: "健康(精神)", key: "精神" },
        { label: "健康(頭脳)", key: "頭脳" },
    ];

    rows.forEach(({ label, key }) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${label}</td>${week.map(date => {
            const cellData = data[date]?.[key] || "";
            return `<td>${cellData}</td>`;
        }).join("")}`;
        table.appendChild(row);
    });

    container.appendChild(table);
};


// 時刻選択肢を生成（30分刻み）
const generateTimeOptions = (selectId) => {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = ""; // 既存の選択肢をクリア
    const options = ["しなかった", ...Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour.toString().padStart(2, "0")}:${minute}`;
    })];

    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
};

// 日付変更時のカレンダー更新（main_calendar.jsのdate-inputを利用）
document.getElementById("date-input").addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    const week = getWeekRange(selectedDate); // common.jsの関数を利用
    const data = loadData(healthDataKey); // common.jsの関数を利用
    renderHealthCalendar(data, week);
});

// 健康データの保存
document.getElementById("health-save-button").addEventListener("click", () => {
    const date = document.getElementById("date-input").value; // main_calendar.jsのdate-inputを利用
    const data = loadData(healthDataKey); // common.jsの関数を利用

    if (!data[date]) {
        data[date] = {};
    }

    data[date]["朝食"] = document.getElementById("breakfast-time").value;
    data[date]["昼食"] = document.getElementById("lunch-time").value;
    data[date]["夕食"] = document.getElementById("dinner-time").value;
    data[date]["投薬時刻"] = document.getElementById("medication-time").value;
    data[date]["投薬種類"] = document.getElementById("medication-type").value;
    data[date]["肉体"] = document.getElementById("health-physical").value;
    data[date]["精神"] = document.getElementById("health-mental").value;
    data[date]["頭脳"] = document.getElementById("health-brain").value;

    saveData(healthDataKey, data); // common.jsの関数を利用

    const week = getWeekRange(date); // common.jsの関数を利用
    renderHealthCalendar(data, week);
});

document.addEventListener("DOMContentLoaded", () => {
    const today = document.getElementById("date-input").value; // main_calendar.jsの初期値を取得
    ["breakfast-time", "lunch-time", "dinner-time", "medication-time"].forEach(generateTimeOptions);
    const week = getWeekRange(today); // common.jsの関数を利用
    const data = loadData(healthDataKey); // common.jsの関数を利用
    renderHealthCalendar(data, week);
});

// 入力フォームの初期値を設定
const setHealthFormDefaults = () => {
    const date = document.getElementById("date-input").value;
    const data = loadData(healthDataKey); // ローカルストレージからデータを取得

    const health = data[date] || {};

    // 各フォームに初期値を設定
    document.getElementById("breakfast-time").value = health["朝食"] || "しなかった";
    document.getElementById("lunch-time").value = health["昼食"] || "しなかった";
    document.getElementById("dinner-time").value = health["夕食"] || "しなかった";
    document.getElementById("medication-time").value = health["投薬時刻"] || "しなかった";
    document.getElementById("medication-type").value = health["投薬種類"] || "";
    document.getElementById("health-physical").value = health["肉体"] || "";
    document.getElementById("health-mental").value = health["精神"] || "";
    document.getElementById("health-brain").value = health["頭脳"] || "";
};

// 日付が変更された際に初期値を設定
document.getElementById("date-input").addEventListener("change", setHealthFormDefaults);

// 初期化時にフォームの初期値を設定
document.addEventListener("DOMContentLoaded", () => {
    const today = document.getElementById("date-input").value; // main_calendar.jsの初期値を取得
    setHealthFormDefaults(); // フォームの初期値を設定
});
