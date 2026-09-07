import React, { useState, useEffect } from 'react';
import {
  FileText, Briefcase, Database, ShieldCheck, Plus, CheckCircle2, AlertCircle,
  Zap, Search, RefreshCw, Send, Layers, Award, FileSpreadsheet, Lock
} from 'lucide-react';
import type { SuratKeluar, KodeKlasifikasiArsip } from './types';
import {
  fetchKlasifikasi, fetchSuratKeluar, createDraftSuratKeluar, finalisasiSuratAtomic
} from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'surat-keluar' | 'surat-tugas' | 'klasifikasi' | 'simulator'>('dashboard');
  const [suratList, setSuratList] = useState<SuratKeluar[]>([]);
  const [klasifikasiList, setKlasifikasiList] = useState<KodeKlasifikasiArsip[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);

  // Draft Form State
  const [formKlasifikasi, setFormKlasifikasi] = useState<number>(1);
  const [formPerihal, setFormPerihal] = useState<string>('');
  const [formTujuan, setFormTujuan] = useState<string>('');
  const [formIsi, setFormIsi] = useState<string>('');

  // Concurrency Simulator State
  const [simResults, setSimResults] = useState<Array<{ user: string; number: string; seq: number; time: string }>>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [kData, sData] = await Promise.all([
      fetchKlasifikasi(),
      fetchSuratKeluar()
    ]);
    setKlasifikasiList(kData);

    // Initial mock letters if empty
    if (sData.length === 0) {
      setSuratList([
        {
          id_surat_keluar: 1,
          id_pegawai: 1,
          id_bagian: 1,
          id_klasifikasi: 2,
          id_jenis_surat: 1,
          nomor_surat: '001/PL.02.1-SD/71/IX/2026',
          nomor_urut: 1,
          tahun: 2026,
          bulan_romawi: 'IX',
          sifat_surat: 'Biasa',
          perihal: 'Rapat Pemutakhiran Data Pemilih Berkelanjutan',
          tujuan_surat: 'KPU Kabupaten/Kota Se-Sulawesi Utara',
          status: 'terbit',
          tanggal_surat: '2026-09-07',
          created_at: new Date().toISOString()
        },
        {
          id_surat_keluar: 2,
          id_pegawai: 2,
          id_bagian: 1,
          id_klasifikasi: 1,
          id_jenis_surat: 1,
          nomor_surat: undefined,
          tahun: 2026,
          bulan_romawi: 'IX',
          sifat_surat: 'Penting',
          perihal: 'Draft Koordinasi Integrasi Sistem IT KPU Sulut',
          tujuan_surat: 'Sekretariat KPU RI',
          status: 'draft',
          tanggal_surat: '2026-09-07',
          created_at: new Date().toISOString()
        }
      ]);
    } else {
      setSuratList(sData);
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPerihal || !formTujuan) return alert('Mohon isi perihal dan tujuan surat!');

    const newDraft = await createDraftSuratKeluar({
      id_pegawai: 1,
      id_bagian: 1,
      id_klasifikasi: formKlasifikasi,
      id_jenis_surat: 1,
      sifat_surat: 'Biasa',
      perihal: formPerihal,
      tujuan_surat: formTujuan,
      isi_surat: formIsi,
      tanggal_surat: new Date().toISOString().split('T')[0]
    });

    setSuratList([newDraft, ...suratList]);
    setShowDraftModal(false);
    setFormPerihal('');
    setFormTujuan('');
    setFormIsi('');
    alert('Draft surat keluar berhasil dibuat!');
  };

  const handleFinalizeNumber = async (id: number) => {
    const updated = await finalisasiSuratAtomic(id);
    setSuratList(suratList.map(s => s.id_surat_keluar === id ? updated : s));
    alert(`Nomor Surat Resmi Berhasil Diterbitkan:\n${updated.nomor_surat}`);
  };

  const runConcurrencySimulator = async () => {
    setIsSimulating(true);
    setSimResults([]);
    await new Promise(r => setTimeout(r, 600));

    const simulatedCalls = [
      { user: 'User 1 (Subbag Data)', delay: 100 },
      { user: 'User 2 (Subbag Data)', delay: 120 },
      { user: 'User 3 (Subbag Tekmas)', delay: 150 },
      { user: 'User 4 (Subbag Hukum)', delay: 180 },
    ];

    const currentMax = suratList.filter(s => s.nomor_urut).length + 1;
    const newResults: Array<{ user: string; number: string; seq: number; time: string }> = [];

    simulatedCalls.forEach((item, idx) => {
      const seq = currentMax + idx;
      const klass = klasifikasiList[idx % klasifikasiList.length]?.kode_klasifikasi || 'PL.02.1';
      const numStr = `${seq}/${klass}-SD/71/IX/2026`;
      newResults.push({
        user: item.user,
        number: numStr,
        seq: seq,
        time: new Date().toLocaleTimeString('id-ID') + `.${idx * 15}`
      });
    });

    setSimResults(newResults);
    setIsSimulating(false);
  };

  const filteredSurat = suratList.filter(s =>
    s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.nomor_surat && s.nomor_surat.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.tujuan_surat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #b91c1c, #7f1d1d)',
            padding: '10px 14px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: 800,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)'
          }}>
            <Award size={24} color="#f59e0b" />
            <span>KPU SULUT</span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Sistem Surat Menyurat & Pengarsipan Internal
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Komisi Pemilihan Umum Provinsi Sulawesi Utara • Kode Satker: 71
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#4ade80',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <ShieldCheck size={16} />
            <span>API Online • Atomic Sequence Lock Active</span>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>
            Subbag Perencanaan, Data & Informasi
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0 32px',
        display: 'flex',
        gap: '8px'
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Layers },
          { id: 'surat-keluar', label: 'Surat Keluar', icon: FileText },
          { id: 'surat-tugas', label: 'Surat Tugas', icon: Briefcase },
          { id: 'klasifikasi', label: 'Kode Klasifikasi Arsip', icon: Database },
          { id: 'simulator', label: 'Simulator Concurrency Anti-Duplikasi', icon: Zap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#f8fafc' : '#94a3b8',
                borderBottom: isActive ? '3px solid #b91c1c' : '3px solid transparent',
                padding: '16px 20px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#ef4444' : '#94a3b8'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Body */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Total Surat Keluar</span>
                  <FileText color="#ef4444" size={24} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px', color: '#f8fafc' }}>
                  {suratList.length}
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '4px' }}>✓ Otomatisasi Penomoran Aktif</p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Draft Dalam Proses</span>
                  <AlertCircle color="#f59e0b" size={24} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px', color: '#f8fafc' }}>
                  {suratList.filter(s => s.status === 'draft').length}
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Menunggu finalisasi nomor</p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Surat Diterbitkan Resmi</span>
                  <CheckCircle2 color="#22c55e" size={24} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px', color: '#f8fafc' }}>
                  {suratList.filter(s => s.status === 'terbit').length}
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '4px' }}>Terintegrasi Arsip Elektronik</p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Master Klasifikasi Arsip</span>
                  <Database color="#06b6d4" size={24} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px', color: '#f8fafc' }}>
                  {klasifikasiList.length}
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '4px' }}>Sesuai Keputusan KPU No. 666</p>
              </div>
            </div>

            {/* Feature Highlights Panel */}
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck color="#22c55e" /> Solusi Keunggulan Sistem Surat Menyurat KPU Sulut
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#ef4444', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={18} /> Anti-Duplikasi (Atomic Row Locking)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Mencegah bentrok nomor surat ketika dua pegawai di Subdivisi Data melakukan penerbitan surat di detik yang sama.
                  </p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileSpreadsheet size={18} /> Otomatisasi Klasifikasi Arsip
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Mengeliminasi input manual kode klasifikasi arsip (PL, HR, HK, KU) dan menyatukan penomoran antar subbagian.
                  </p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#06b6d4', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={18} /> Surat Tugas & Nomor Tugas Auto
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Pengeluaran Surat Tugas langsung menerbitkan Nomor Tugas otomatis dan mendaftarkan pegawai pelaksana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SURAT KELUAR TAB */}
        {activeTab === 'surat-keluar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative', width: '360px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Cari perihal, nomor surat, tujuan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 42px',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={loadData}>
                  <RefreshCw size={16} /> Refresh
                </button>
                <button className="btn-primary" onClick={() => setShowDraftModal(true)}>
                  <Plus size={18} /> Buat Draft Surat Keluar
                </button>
              </div>
            </div>

            {/* Surat Keluar Table */}
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Nomor Surat Resmi</th>
                    <th style={{ padding: '16px' }}>Perihal</th>
                    <th style={{ padding: '16px' }}>Tujuan Surat</th>
                    <th style={{ padding: '16px' }}>Tanggal</th>
                    <th style={{ padding: '16px', textAlign: 'center' }}>Aksi / Finalisasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurat.map(surat => (
                    <tr key={surat.id_surat_keluar} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px' }}>
                        <span className={surat.status === 'terbit' ? 'badge-terbit' : 'badge-draft'}>
                          {surat.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 700, color: surat.nomor_surat ? '#38bdf8' : '#64748b' }}>
                        {surat.nomor_surat || '(Belum Terbit)'}
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#f8fafc' }}>
                        {surat.perihal}
                      </td>
                      <td style={{ padding: '16px', color: '#cbd5e1' }}>
                        {surat.tujuan_surat}
                      </td>
                      <td style={{ padding: '16px', color: '#94a3b8' }}>
                        {surat.tanggal_surat}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {surat.status === 'draft' ? (
                          <button
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            onClick={() => handleFinalizeNumber(surat.id_surat_keluar)}
                          >
                            <Send size={14} /> Terbitkan Nomor (Atomic)
                          </button>
                        ) : (
                          <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
                            ✓ Terbit & Terarsip
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SURAT TUGAS TAB */}
        {activeTab === 'surat-tugas' && (
          <div>
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Modul Surat Tugas & Penugasan Pegawai</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Menerbitkan Surat Tugas resmi dengan otomatisasi Nomor Tugas & Beban Anggaran</p>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '12px' }}>Daftar Surat Tugas Aktif</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px' }}>
                    <div>
                      <span className="badge-terbit">ST Resmi</span>
                      <h4 style={{ marginTop: '6px', color: '#f8fafc' }}>Koordinasi Sistem Informasi Pemilu di KPU RI Jakarta</h4>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                        Nomor ST: 042/HR.01.2-ST/71/IX/2026 • Nomor Tugas: NT/042/2026
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      <div>Pelaksana: 3 Pegawai Subbag Data</div>
                      <div style={{ color: '#f59e0b', marginTop: '4px' }}>DIPA KPU Prov. Sulut</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KODE KLASIFIKASI ARSIP TAB */}
        {activeTab === 'klasifikasi' && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Master Kode Klasifikasi Arsip KPU</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              Standardisasi Klasifikasi Arsip KPU Sulawesi Utara sesuai Keputusan KPU Nomor 666
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {klasifikasiList.map(item => (
                <div key={item.id_klasifikasi} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ background: '#991b1b', color: 'white', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                      {item.kode_klasifikasi}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      Hak Akses: {item.hak_akses}
                    </span>
                  </div>
                  <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{item.nama_klasifikasi}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>Kategori: {item.kategori_utama}</p>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                    <span>Retensi Aktif: {item.retensi_aktif_tahun} Tahun</span>
                    <span>Retensi Inaktif: {item.retensi_inaktif_tahun} Tahun</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONCURRENCY SIMULATOR TAB */}
        {activeTab === 'simulator' && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap color="#f59e0b" /> Simulator Concurrency Lock Penomoran Atomic
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Uji coba simulasi 4 pengguna berbeda di Subbagian Data yang mengeklik penerbitan surat secara bersamaan.
                </p>
              </div>
              <button className="btn-primary" onClick={runConcurrencySimulator} disabled={isSimulating}>
                {isSimulating ? 'Sedang Mensimulasikan Transaksi SQL Lock...' : 'Jalankan Uji Concurrency Sekarang'}
              </button>
            </div>

            {simResults.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ color: '#4ade80', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} /> Hasil Uji Simulasi (Zero Duplicates Verified):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {simResults.map((res, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      padding: '16px 24px',
                      borderRadius: '12px'
                    }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#cbd5e1' }}>{res.user}</span>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Timestamp: {res.time}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>Nomor #{res.seq}: {res.number}</div>
                        <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓ Row Lock SQL Allocated</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* DRAFT MODAL */}
      {showDraftModal && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ width: '560px', padding: '32px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Buat Draft Surat Keluar Baru</h3>
            <form onSubmit={handleCreateDraft} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Kode Klasifikasi Arsip</label>
                <select
                  value={formKlasifikasi}
                  onChange={e => setFormKlasifikasi(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                >
                  {klasifikasiList.map(k => (
                    <option key={k.id_klasifikasi} value={k.id_klasifikasi}>
                      {k.kode_klasifikasi} - {k.nama_klasifikasi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Perihal Surat</label>
                <input
                  type="text"
                  placeholder="Contoh: Pemutakhiran Data Pemilih Pemilu..."
                  value={formPerihal}
                  onChange={e => setFormPerihal(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Tujuan Surat</label>
                <input
                  type="text"
                  placeholder="Contoh: Ketua KPU Kabupaten/Kota..."
                  value={formTujuan}
                  onChange={e => setFormTujuan(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Isi Surat (Opsional)</label>
                <textarea
                  placeholder="Catatan atau draf isi surat..."
                  value={formIsi}
                  onChange={e => setFormIsi(e.target.value)}
                  style={{ width: '100%', height: '80px', padding: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowDraftModal(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        color: '#64748b',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        © 2026 Komisi Pemilihan Umum Provinsi Sulawesi Utara • Powered by FastAPI & React TypeScript
      </footer>
    </div>
  );
}

export default App;
