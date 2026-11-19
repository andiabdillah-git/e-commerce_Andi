/* Halaman UTAMA */
const sliderTrack = document.querySelector('.andi_slider_track');
const daftarSlide = document.querySelectorAll('.andi_slide_item');
const btnPrev = document.getElementById('andi_prev_slide');
const btnNext = document.getElementById('andi_next_slide');

if (sliderTrack && daftarSlide.length > 0) {
    let indexSlide = 0;

    function geserSlide(indexBaru) {
        if (indexBaru >= daftarSlide.length) {
            indexSlide = 0;
        } 
        else if (indexBaru < 0) {
            indexSlide = daftarSlide.length - 1;
        } 
        else {
            indexSlide = indexBaru;
        }

        sliderTrack.style.transform = `translateX(-${indexSlide * 100}%)`;
    }

    btnNext.addEventListener('click', function() {
        geserSlide(indexSlide + 1);
    });

    btnPrev.addEventListener('click', function() {
        geserSlide(indexSlide - 1);
    });
}
/* untuk Search bar all */
const btnSearch = document.getElementById('andi_btn_search');
const searchBar = document.getElementById('andi_search_bar');
const inputSearch = document.getElementById('andi_input_search');
const closeSearch = document.getElementById('andi_close_search');

function filterPencarianKatalog(kataKunci) {
    const produkKatalog = document.querySelectorAll('.andi_katalog_semua .andi_produk_item');
    const tombolKategori = document.querySelectorAll('.andi_filter_kategori a');
    if (produkKatalog.length === 0) return;

    const keyword = kataKunci.toLowerCase().trim();

    if (keyword !== '' && tombolKategori.length > 0) {
        tombolKategori.forEach(item => item.classList.remove('andi_filter_aktif'));
        tombolKategori[0].classList.add('andi_filter_aktif');
    }

    produkKatalog.forEach(produk => {
        const judul = produk.querySelector('.andi_produk_judul').textContent.toLowerCase();
        const kategori = produk.getAttribute('data-kategori').toLowerCase();

      
        if (judul.includes(keyword) || kategori.includes(keyword)) {
            produk.style.display = '';
        } else {
            produk.style.display = 'none';
        }
    });
}

if (btnSearch && searchBar && inputSearch) {
    btnSearch.addEventListener('click', function(event) {
        event.preventDefault();
        searchBar.classList.toggle('andi_search_aktif');
        if (searchBar.classList.contains('andi_search_aktif')) {
            inputSearch.focus();
        }
    });

    closeSearch.addEventListener('click', function() {
        searchBar.classList.remove('andi_search_aktif');
        inputSearch.value = '';
        filterPencarianKatalog('');
    });
    inputSearch.addEventListener('input', function() {
        filterPencarianKatalog(this.value);
    });
    inputSearch.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const kataKunci = this.value.trim();
            if (!kataKunci) return;

            const seksiSemuaProduk = document.querySelector('.andi_katalog_semua');
            if (seksiSemuaProduk) {
                seksiSemuaProduk.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'katalog.html?search=' + encodeURIComponent(kataKunci);
            }
        }
    });
    const parameterURL = new URLSearchParams(window.location.search);
    const kirimanSearch = parameterURL.get('search');

    if (kirimanSearch && document.querySelector('.andi_katalog_semua')) {
        searchBar.classList.add('andi_search_aktif');
        inputSearch.value = kirimanSearch;
        filterPencarianKatalog(kirimanSearch);
        document.querySelector('.andi_katalog_semua').scrollIntoView({ behavior: 'smooth' });
    }
}

/* Untuk Katalog*/
const tombolFilter = document.querySelectorAll('.andi_filter_kategori a');
const daftarProduk = document.querySelectorAll('.andi_katalog_semua .andi_produk_item');

if (tombolFilter.length > 0) {
    tombolFilter.forEach(tombol => {
        tombol.addEventListener('click', function(event) {
            event.preventDefault();

            tombolFilter.forEach(item => item.classList.remove('andi_filter_aktif'));
            this.classList.add('andi_filter_aktif');

            const kategoriDipilih = this.getAttribute('data-filter');

            daftarProduk.forEach(produk => {
                const kategoriProduk = produk.getAttribute('data-kategori').split(' ');

                if (kategoriDipilih === 'all' || kategoriProduk.includes(kategoriDipilih)) {
                    produk.style.display = '';
                } else {
                    produk.style.display = 'none';
                }
            });
        });
    });
}
/* Untuk Keranjang checkout*/
(function () {
    let keranjangBelanja = JSON.parse(localStorage.getItem('andi_maison_bag')) || [];

    function updateBadge() {
        const badge = document.getElementById('andi_jumlah_keranjang');
        if (badge) {
            badge.textContent = keranjangBelanja.reduce((total, item) => total + item.qty, 0);
        }
    }

    function simpanData() {
        localStorage.setItem('andi_maison_bag', JSON.stringify(keranjangBelanja));
        updateBadge();
    }

    const wadahItemBag = document.getElementById('andi_daftar_item_bag');
    const kotakIsi = document.getElementById('andi_keranjang_isi');
    const kotakKosong = document.getElementById('andi_keranjang_kosong');
    const pilihKurir = document.getElementById('andi_pilih_kurir');

    function hitungTotal() {
        const subtotalEl = document.getElementById('andi_checkout_subtotal');
        const ongkirEl = document.getElementById('andi_checkout_ongkir');
        const totalEl = document.getElementById('andi_checkout_total');
        if (!subtotalEl || !totalEl) return;

        const subtotal = keranjangBelanja.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        const ongkir = pilihKurir ? parseInt(pilihKurir.value, 10) : 0;

        subtotalEl.textContent = '$' + subtotal.toLocaleString('en-US');
        ongkirEl.textContent = ongkir === 0 ? 'Free' : '$' + ongkir;
        totalEl.textContent = '$' + (subtotal + ongkir).toLocaleString('en-US');
    }

    function renderCheckout() {
        if (!wadahItemBag) return;

        if (keranjangBelanja.length === 0) {
            kotakIsi.style.display = 'none';
            kotakKosong.style.display = 'block';
            return;
        }

        kotakIsi.style.display = 'grid';
        kotakKosong.style.display = 'none';
        wadahItemBag.innerHTML = '';

        keranjangBelanja.forEach((item, index) => {
            const baris = document.createElement('div');
            baris.className = 'andi_item_bag';
            baris.innerHTML = `
                <img src="${item.gambar}" alt="${item.nama}" class="andi_bag_gambar">
                <div class="andi_bag_detail">
                    <h3>${item.nama}</h3>
                    <div class="andi_bag_qty">
                        <button type="button" class="andi_btn_qty" data-aksi="kurang" data-index="${index}">-</button>
                        <span>${item.qty}</span>
                        <button type="button" class="andi_btn_qty" data-aksi="tambah" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="andi_bag_kanan">
                    <p class="andi_bag_harga">$${(item.harga * item.qty).toLocaleString('en-US')}</p>
                    <button type="button" class="andi_btn_hapus" data-aksi="hapus" data-index="${index}">Remove</button>
                </div>
            `;
            wadahItemBag.appendChild(baris);
        });

        hitungTotal();
    }

    if (wadahItemBag) {
        wadahItemBag.addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;

            const idx = parseInt(btn.getAttribute('data-index'), 10);
            const aksi = btn.getAttribute('data-aksi');

            if (aksi === 'tambah') {
                keranjangBelanja[idx].qty += 1;
            } else if (aksi === 'kurang') {
                if (keranjangBelanja[idx].qty > 1) keranjangBelanja[idx].qty -= 1;
                else keranjangBelanja.splice(idx, 1);
            } else if (aksi === 'hapus') {
                keranjangBelanja.splice(idx, 1);
            }

            simpanData();
            renderCheckout();
        });

        if (pilihKurir) pilihKurir.addEventListener('change', hitungTotal);

        const formCheckout = document.getElementById('andi_form_checkout');
        if (formCheckout) {
            formCheckout.addEventListener('submit', function (e) {
                e.preventDefault();
                keranjangBelanja = [];
                simpanData();
                document.getElementById('andi_pesan_status').textContent =
                    'Thank you! Your private order has been placed.';
                renderCheckout();
            });
        }

        renderCheckout();
    }

    updateBadge();
})();

/* Produk & Detail Produk */
(function () {
    function tambahKeTas(nama, gambar, harga) {
        let keranjang = JSON.parse(localStorage.getItem('andi_maison_bag')) || [];
        const sudahAda = keranjang.find(item => item.nama === nama);

        if (sudahAda) {
            sudahAda.qty += 1;
        } else {
            keranjang.push({ nama, gambar, harga, qty: 1 });
        }

        localStorage.setItem('andi_maison_bag', JSON.stringify(keranjang));

        const badge = document.getElementById('andi_jumlah_keranjang');
        if (badge) {
            badge.textContent = keranjang.reduce((total, item) => total + item.qty, 0);
        }

        let toast = document.querySelector('.andi_toast_bag');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'andi_toast_bag';
            document.body.appendChild(toast);
        }
        toast.textContent = `+ ${nama} added to bag`;
        toast.classList.add('andi_toast_muncul');

        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.classList.remove('andi_toast_muncul');
        }, 2200);
    }

    // 1. Tombol ADD TO BAG & klik ke produk.html di semua kartu produk
    const semuaKartu = document.querySelectorAll('.andi_kartu_trending, .andi_produk_item, .andi_kartu_katalog');
    semuaKartu.forEach(kartu => {
        const elNama = kartu.querySelector('.andi_nama_item, .andi_produk_judul');
        const elGambar = kartu.querySelector('img');
        const elKategori = kartu.querySelector('.andi_kategori_item, .andi_produk_kategori');
        const elHarga = Array.from(kartu.querySelectorAll('p')).find(p => p.textContent.includes('$'));

        if (!elNama || !elGambar || !elHarga) return;

        const nama = elNama.textContent.trim();
        const gambar = elGambar.getAttribute('src');
        const kategori = elKategori ? elKategori.textContent.trim() : 'ANDY MAISON';
        const harga = parseInt(elHarga.textContent.replace(/[^0-9]/g, ''), 10) || 0;

        kartu.addEventListener('click', function () {
            localStorage.setItem('andi_detail_produk', JSON.stringify({ nama, gambar, kategori, harga }));
            window.location.href = 'produk.html?item=' + encodeURIComponent(nama);
        });

        if (!kartu.querySelector('.andi_btn_add_bag')) {
            const btnTambah = document.createElement('button');
            btnTambah.type = 'button';
            btnTambah.className = 'andi_btn_add_bag';
            btnTambah.textContent = 'ADD TO BAG';
            kartu.appendChild(btnTambah);

            btnTambah.addEventListener('click', function (e) {
                e.stopPropagation();
                tambahKeTas(nama, gambar, harga);
            });
        }
    });

    // 2. Isi otomatis halaman produk.html
    const wadahDetail = document.getElementById('andi_detail_container');
    if (wadahDetail) {
        const data = JSON.parse(localStorage.getItem('andi_detail_produk'));
        let ukuran = 'M';

        if (data) {
                document.getElementById('andi_detail_gambar').src = data.gambar;
                document.getElementById('andi_detail_kategori').textContent = data.kategori.toUpperCase();
                document.getElementById('andi_detail_nama').textContent = data.nama;
                document.getElementById('andi_detail_harga').textContent = '$' + data.harga.toLocaleString('en-US');

                const tombolSizes = document.querySelectorAll('.andi_btn_size');

        
                if (data.kategori.toLowerCase().includes('ml') || data.gambar.toLowerCase().includes('fragrance')) {
                    const volumeList = ['50 ML', '100 ML', '200 ML'];
                    tombolSizes.forEach((btn, idx) => {
                        if (volumeList[idx]) btn.textContent = volumeList[idx];
                    });
                    ukuran = '100 ML';
                }
                tombolSizes.forEach(btn => {
                    btn.addEventListener('click', function () {
                        tombolSizes.forEach(b => b.classList.remove('andi_size_aktif'));
                        this.classList.add('andi_size_aktif');
                        ukuran = this.textContent.trim();
                    });
                });

                document.getElementById('andi_detail_add_btn').addEventListener('click', function () {
                    tambahKeTas(`${data.nama} (${ukuran})`, data.gambar, data.harga);
            });
        }
    }
})();

/* Navigasi Langsung ke Tab WOMEN / MEN di Katalog */
(function () {
    // 1. Tangkap klik WOMEN & MEN di navbar atas dari halaman mana pun
    document.querySelectorAll('.andi_nav_kiri a').forEach(link => {
        const teks = link.textContent.trim().toLowerCase();
        if (teks === 'women' || teks === 'men') {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                if (document.querySelector('.andi_filter_kategori')) {
                    jalankanFilterDanScroll(teks);
                } else {
                    window.location.href = 'katalog.html?kat=' + teks;
                }
            });
        }
    });

    function jalankanFilterDanScroll(kategoriTarget) {
        const filterBar = document.querySelector('.andi_filter_kategori');
        if (!filterBar) return;

        filterBar.querySelectorAll('a').forEach(tab => {
            if (tab.textContent.trim().toLowerCase() === kategoriTarget) {
                tab.click();
            }
        });

        const prev = filterBar.previousElementSibling;
        const targetScroll = (prev && prev.tagName === 'P' && prev.previousElementSibling)
            ? prev.previousElementSibling
            : (prev || filterBar);

        setTimeout(() => {
            const posisiY = targetScroll.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: posisiY, behavior: 'smooth' });
        }, 80);
    }
    const params = new URLSearchParams(window.location.search);
    const katURL = (params.get('kat') || params.get('kategori') || '').toLowerCase().trim();
    if (katURL === 'women' || katURL === 'men') {
        jalankanFilterDanScroll(katURL);
    }
})();

/* Tombol newslater subscribe */
document.querySelectorAll('.andi_form_newsletter').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = this.querySelector('.andi_input_newsletter');
        const btn = this.querySelector('.andi_btn_newsletter');
        const email = input.value.trim();

        if (!email) return;
        input.value = '';
        btn.textContent = 'SUBSCRIBED ✓';
        btn.style.backgroundColor = '#111111';
        btn.style.border = '1px solid var(--andi-emas)';

        let toast = document.querySelector('.andi_toast_bag');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'andi_toast_bag';
            document.body.appendChild(toast);
        }
        toast.textContent = 'Welcome to ANDY MAISON Private List.';
        toast.classList.add('andi_toast_muncul');

        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.classList.remove('andi_toast_muncul');
        }, 2500);

        setTimeout(() => {
            btn.textContent = 'SUBSCRIBE';
            btn.style.backgroundColor = '';
            btn.style.border = '';
        }, 3000);
    });
});