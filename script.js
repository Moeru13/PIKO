// ============================
// Inisialisasi Variabel Data
// ============================
let dataList = [];

// ============================
// Mengisi Select (1–5)
// ============================
function loadSelectOptions() {
    const selects = ["kenyamanan", "keragaman", "kualitas"];

    selects.forEach(id => {
        const select = document.getElementById(id);
        for (let i = 1; i <= 5; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = i;
            select.appendChild(opt);
        }
    });
}

// ============================
// Menampilkan Tabel
// ============================
function renderTable() {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    dataList.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.nama}</td>
            <td>${row.kenyamanan}</td>
            <td>${row.keragaman}</td>
            <td>${row.kualitas}</td>
            <td>
                <button onclick="deleteData(${index})" style="background:#d9534f">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateChart();
}

// ============================
// Tambah Data Manual
// ============================
function addData() {
    const nama = document.getElementById("nama").value.trim();
    const k1 = parseInt(document.getElementById("kenyamanan").value);
    const k2 = parseInt(document.getElementById("keragaman").value);
    const k3 = parseInt(document.getElementById("kualitas").value);

    if (nama === "") {
        alert("Nama tidak boleh kosong!");
        return;
    }

    dataList.push({ nama: nama, kenyamanan: k1, keragaman: k2, kualitas: k3 });
    renderTable();

    // Reset input agar rapi
    document.getElementById("nama").value = "";
}

// ============================
// Hapus Data Baris Tertentu
// ============================
function deleteData(index) {
    dataList.splice(index, 1);
    renderTable();
}

// ============================
// Load data.csv
// Format CSV harus: nama,kenyamanan,kebersihan,pelayanan
// ============================
function loadCSV() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const lines = event.target.result.split(/\r?\n/);
            dataList = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const cols = lines[i].split(",");

                dataList.push({
                    nama: cols[0],
                    kenyamanan: parseInt(cols[1]),
                    keragaman: parseInt(cols[2]),
                    kualitas: parseInt(cols[3])
                });
            }

            renderTable();
        };

        reader.readAsText(file);
    };

    input.click();
}

// ============================
// Chart.js Histogram
// ============================
let chart;

function initChart() {
    const ctx = document.getElementById("histChart");

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1", "2", "3", "4", "5"],
            datasets: [
                {
                    label: "Kenyamanan",
                    backgroundColor: "rgba(255,99,132,0.6)",
                    data: [0, 0, 0, 0, 0]
                },
                {
                    label: "Keragaman",
                    backgroundColor: "rgba(54,162,235,0.6)",
                    data: [0, 0, 0, 0, 0]
                },
                {
                    label: "Kualitas",
                    backgroundColor: "rgba(255,206,86,0.6)",
                    data: [0, 0, 0, 0, 0]
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateChart() {
    if (!chart) return;

    const aspek = ["kenyamanan", "keragaman", "kualitas"];

    aspek.forEach((a, idx) => {
        const counts = [0, 0, 0, 0, 0];
        dataList.forEach(row => counts[row[a] - 1]++);
        chart.data.datasets[idx].data = counts;
    });

    chart.update();
}

// ============================
// Event Listener
// ============================
document.getElementById("btnSubmit").addEventListener("click", addData);
document.getElementById("btnLoadCSV").addEventListener("click", loadCSV);

// ============================
// Init Saat Page Load
// ============================
window.onload = () => {
    loadSelectOptions();
    initChart();
};
