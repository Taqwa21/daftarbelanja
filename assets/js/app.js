const namaItemInput = document.getElementById("namaItem");
const jumlahItemInput = document.getElementById("jumlahItem");
const pemilikItemInput = document.getElementById("pemilikItem");
const hargaItemInput = document.getElementById("hargaItem");
const catatanItemInput = document.getElementById("catatanItem");
const btnTambah = document.getElementById("btnTambah");
const daftarBelanja = document.getElementById("daftarBelanja");
const totalItemEl = document.getElementById("totalItem");
const totalJumlahEl = document.getElementById("totalJumlah");

let dataBelanja = JSON.parse(localStorage.getItem("dataBelanja")) || [];
let filterStatus = "all";
let indexEdit = null;

/* format harga */
function formatRupiah(angka) {
  if (!angka) return "";
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function simpanData() {
  localStorage.setItem("dataBelanja", JSON.stringify(dataBelanja));
}

function updateInfo() {
  totalItemEl.textContent = `Total item: ${dataBelanja.length}`;
  const totalJumlah = dataBelanja.reduce((acc, item) => acc + item.jumlah, 0);
  totalJumlahEl.textContent = `Total jumlah: ${totalJumlah}`;
}

function renderList() {
  daftarBelanja.innerHTML = "";

  let dataTampil = dataBelanja;
  if (filterStatus === "belum") {
    dataTampil = dataBelanja.filter((i) => !i.selesai);
  } else if (filterStatus === "sudah") {
    dataTampil = dataBelanja.filter((i) => i.selesai);
  }

  dataTampil.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `item ${item.selesai ? "selesai" : ""}`;

    li.innerHTML = `
      <div class="item-header">
        <label>
          <input type="checkbox" data-index="${index}" ${
      item.selesai ? "checked" : ""
    }>
          <span class="item-nama">${item.nama}</span>
        </label>
        <span class="item-jumlah">x${item.jumlah}</span>
      </div>

      <div class="item-meta">
        ${
          item.pemilik
            ? `<span class="badge pemilik">Untuk ${item.pemilik}</span>`
            : ""
        }
        ${
          item.harga
            ? `<span class="badge harga">Rp ${formatRupiah(item.harga)}</span>`
            : ""
        }
      </div>

      ${
        item.catatan
          ? `
        <div class="item-note">
          ${item.catatan}
        </div>
      `
          : ""
      }

      <div class="item-aksi">
        <button class="edit" data-index="${index}">Edit</button>
        <button class="hapus" data-index="${index}">Hapus</button>
      </div>
    `;

    daftarBelanja.appendChild(li);
  });

  updateInfo();
}

/* tambah / edit */
btnTambah.addEventListener("click", () => {
  const nama = namaItemInput.value.trim();
  const jumlah = parseInt(jumlahItemInput.value);
  const pemilik = pemilikItemInput.value.trim();
  const harga = parseInt(hargaItemInput.value);
  const catatan = catatanItemInput.value.trim();

  if (!nama || !jumlah) {
    alert("Nama item dan jumlah wajib diisi");
    return;
  }

  const data = {
    nama,
    jumlah,
    pemilik,
    harga: harga || 0,
    catatan,
    selesai: false,
  };

  if (indexEdit !== null) {
    dataBelanja[indexEdit] = {
      ...dataBelanja[indexEdit],
      ...data,
    };
    indexEdit = null;
    btnTambah.textContent = "Tambah Item";
  } else {
    dataBelanja.push(data);
  }

  simpanData();
  renderList();

  namaItemInput.value = "";
  jumlahItemInput.value = "";
  pemilikItemInput.value = "";
  hargaItemInput.value = "";
  catatanItemInput.value = "";
});

/* klik list */
daftarBelanja.addEventListener("click", (e) => {
  const index = e.target.dataset.index;

  if (e.target.type === "checkbox") {
    dataBelanja[index].selesai = e.target.checked;
  }

  if (e.target.classList.contains("hapus")) {
    dataBelanja.splice(index, 1);
  }

  if (e.target.classList.contains("edit")) {
    const item = dataBelanja[index];
    namaItemInput.value = item.nama;
    jumlahItemInput.value = item.jumlah;
    pemilikItemInput.value = item.pemilik;
    hargaItemInput.value = item.harga;
    catatanItemInput.value = item.catatan;
    indexEdit = index;
    btnTambah.textContent = "Simpan Perubahan";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  simpanData();
  renderList();
});

/* filter */
document.querySelectorAll(".filter-belanja button").forEach((btn) => {
  btn.addEventListener("click", () => {
    filterStatus = btn.dataset.filter;
    renderList();
  });
});

renderList();
