'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaDownload } from 'react-icons/fa';

import useKardex from '../hooks/useKardex';
import { useAuth } from '../hooks/useAuth';
import { downloadPDF, downloadExcel } from '../utils/exportKardex';
import Header from '../components/common/Header2';
import KardexSearch from '../components/kardex/kardexSearch';
import KardexTable from '../components/kardex/kardexTable';
import KardexDownloadModal from '../components/kardex/kardexDownloadModal';

export default function KardexPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { logout } = useAuth();

  const {
    productos,
    filteredProductos,
    searchTerm,
    kardexMovimientos,
    isLoading,
    handleSearch,
    handleSelectProducto,
  } = useKardex();

  const handleDownloadBoth = () => {
    downloadPDF(kardexMovimientos);
    downloadExcel(kardexMovimientos);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header común reutilizable */}
      <Header
        title="Kardex"
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout}
      />

      <div className="flex-1 p-6">
        <KardexSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          productos={filteredProductos}
          onSelect={handleSelectProducto}
        />
<div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold text-[#712b39]">Movimientos del Kardex</h2>
  <button
    onClick={() => setIsModalOpen(true)}
    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#712b39] text-[#712b39] rounded-lg hover:bg-[#712b39] hover:text-white transition-colors"
  >
    <FaDownload className="text-lg" />
    <span className="font-medium">Descargar</span>
  </button>
</div>


        <div className="bg-white p-6 rounded-lg shadow-md">
          <KardexTable movimientos={kardexMovimientos} isLoading={isLoading} />

          {isModalOpen && (
            <KardexDownloadModal
              onClose={() => setIsModalOpen(false)}
              onPDF={() => {
                downloadPDF(kardexMovimientos);
                setIsModalOpen(false);
              }}
              onExcel={() => {
                downloadExcel(kardexMovimientos);
                setIsModalOpen(false);
              }}
              onBoth={() => {
                handleDownloadBoth();
                setIsModalOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
