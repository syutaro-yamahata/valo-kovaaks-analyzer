let chart = null;  // Chart.js グラフオブジェクトを保持

// =========================
// VALORANTの戦績を表示する処理（Flask経由）
// =========================
function searchStats() {
  const valoId = document.getElementById("valoIDInput").value;

  if (!valoId) {
    alert("VALORANT IDを入力してください。");
    return;
  }

  // Flaskの中継APIへリクエスト（JavaScriptから直接Tracker.ggへは行かない）
  const url = `http://localhost:5000/api/valorant?id=${encodeURIComponent(valoId)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("プレイヤーが見つからないか、非公開です。");
      }
      return response.json();
    })
    .then(data => {
      const stats = data.data[0].stats;

      // 戦績情報を取得
      const kd = stats.kd.displayValue;
      const winRate = stats.winRatio.displayValue;
      const headshot = stats.headshotPct.displayValue;

      // HTMLに表示
      document.getElementById("kd").textContent = `K/D: ${kd}`;
      document.getElementById("winRate").textContent = `勝率: ${winRate}`;
      document.getElementById("accuracy").textContent = `ヘッドショット率: ${headshot}`;
    })
    .catch(error => {
      alert("戦績の取得に失敗しました: " + error.message);
      console.error(error);
    });
}

// =============================
// KovaaK'sのCSVファイルを読み込んで表示＆グラフ化
// =============================
function readCSV() {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("CSVファイルを選択してください");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const csvText = event.target.result;

    // 行単位に分割し、空行を除去
    const lines = csvText.split("\n").filter(line => line.trim() !== "");
    const header = lines[0].split(",");
    const headshotIndex = header.indexOf("Headshot%");

    if (headshotIndex === -1) {
      alert("Headshot%列が見つかりませんでした");
      return;
    }

    let output = "日付 | ヘッドショット率\n";
    const labels = []; // グラフ用: 日付
    const data = [];   // グラフ用: ヘッドショット率

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      if (row.length <= headshotIndex) continue;

      const date = row[0];
      const headshot = parseFloat(row[headshotIndex]);
      output += `${date} | ${headshot}%\n`;

      labels.push(date);
      data.push(headshot);
    }

    document.getElementById("csvOutput").textContent = output;
    drawChart(labels, data);
  };

  reader.readAsText(file);
}

// =============================
// Chart.js を使ってグラフを描画
// =============================
function drawChart(labels, data) {
  const ctx = document.getElementById("headshotChart").getContext("2d");

  if (chart) {
    chart.destroy(); // 古いグラフを削除
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'ヘッドショット率(%)',
        data: data,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}
