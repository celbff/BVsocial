// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [valorPersonalizado, setValorPersonalizado] = useState('');
  const navigate = useNavigate();

  const pixKey = "lunara_terapias@jim.com";
  const qrBaseUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        alert('Verifique seu e-mail para confirmar o cadastro.');
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Erro ao processar a solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err?.message || 'Erro ao fazer login com o Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      alert("Chave PIX copiada: " + pixKey);
    } catch {
      alert("Não foi possível copiar. Copie manualmente: " + pixKey);
    }
  };

  const setValor = (valor: string) => {
    setValorPersonalizado(valor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Container Principal */}
      <div className="w-full max-w-sm mx-auto">
        
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          
          {/* Logo/Ícone Circular */}
          <div className="flex justify-center pt-12 pb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-br from-purple-400 to-blue-500 p-1 bg-gradient-to-br from-purple-400 to-blue-500">
                <img
                  src="/og-image.jpg"
                  alt="Bella Vitta"
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </div>
              {/* Ícone de verificação */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center px-8 pb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Bella Vitta</h1>
            <p className="text-sm text-gray-500">Serviços e Vendas em Araraquara/SP</p>
          </div>

          {/* Formulário */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email ou nome de usuário"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50 transition-all font-semibold text-sm mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  isLogin ? 'Entrar' : 'Registrar'
                )}
              </button>
            </form>

            {/* Link Esqueci a Senha */}
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="px-8 pb-6">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-400 text-xs font-medium uppercase">ou</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
          </div>

          {/* Google Login */}
          <div className="px-8 pb-8">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com o Google
            </button>
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div className="text-center mt-6 p-6 bg-white rounded-lg border border-gray-100">
          <span className="text-gray-600 text-sm">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              {isLogin ? 'Cadastre-se' : 'Conecte-se'}
            </button>
          </span>
        </div>

        {/* Footer com Botão de Apoio */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            Apoie o criador do App
          </button>
        </div>
      </div>

      {/* Modal de Apoio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>Apoie este projeto</span>
                <span className="text-red-500">❤️</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Este app não foi feito por robôs (ainda) — foi no suor, dedicação e algumas horas de café.
                Se quiser retribuir, aceitamos PIX! Cada apoio ajuda a manter o projeto firme e forte no condomínio. ☕
              </p>

              {/* Valores Sugeridos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Valores sugeridos:</label>
                <div className="grid grid-cols-3 gap-3">
                  {['5', '10', '20'].map((valor) => (
                    <button
                      key={valor}
                      onClick={() => setValor(valor)}
                      className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                        valorPersonalizado === valor
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      R$ {valor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor Personalizado */}
              <div>
                <label htmlFor="valorPersonalizado" className="block text-sm font-medium text-gray-700 mb-2">
                  Ou escolha o valor do seu cafézinho ☕:
                </label>
                <input
                  type="number"
                  id="valorPersonalizado"
                  value={valorPersonalizado}
                  onChange={(e) => setValorPersonalizado(e.target.value)}
                  placeholder="Digite o valor"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Chave PIX */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Chave PIX:</div>
                <div className="text-sm text-gray-900 font-mono break-all bg-white p-3 rounded border">
                  {pixKey}
                </div>
              </div>

              {/* Ações */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyPixKey}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Copiar PIX
                </button>
                <a
                  href={`${qrBaseUrl}${encodeURIComponent(pixKey)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m-0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m-4-4h4"></path>
                  </svg>
                  QR Code
                </a>
              </div>

              {/* Agradecimento */}
              <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                Obrigado! Sua ajuda mantém este projeto vivo. 🚀
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
