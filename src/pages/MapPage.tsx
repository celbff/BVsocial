// src/pages/MapPage.tsx
// ✅ Removido imports não usados
const MapPage = () => {
  const mapEmbedUrl = "https://www.google.com/maps/d/u/0/embed?mid=1XFELlB7i9JmH3FVd6wR3O8HQ1nAdTSo&ehbc=2E312F";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800">Bella Vitta</h1>
            <p className="text-sm text-gray-600">Serviços e Vendas em Araraquara/SP</p>
          </div>
          <div className="text-right text-sm text-gray-500 hidden md:block">
            <p>📍 Araraquara, São Paulo</p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Mapa de Atendimento</h2>
            <p className="text-gray-600 mt-1">
              Visualize nossa área de cobertura e pontos de interesse em Araraquara.
            </p>
          </div>
          <div className="w-full h-[500px] md:h-[600px]">
            <iframe
              title="Bella Vitta - Mapa de Serviços"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-5">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Bella Vitta. Todos os direitos reservados.</p>
          <p className="mt-1 opacity-80">
            Plataforma de serviços e vendas em Araraquara/SP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MapPage;