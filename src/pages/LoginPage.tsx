// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [valorPersonalizado, setValorPersonalizado] = useState('');

  const pixKey = "lunara_terapias@jim.com";

  // Se já estiver logado, redireciona para home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/',
          },
        });
        if (error) throw error;
        alert('Verifique seu e-mail para confirmar o cadastro.');
        setIsLogin(true);
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/' },
      });
      if (error) throw error;
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao fazer login com o Google.');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm mx-auto">

        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-4 w-24 h-24">
            <img
              src="/og-image2.jpg"
              alt="Bella Vitta"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">CONNECT</h1>
          <p className="text-gray-500 text-sm">Bella Vitta - Serviços e Vendas</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-sm transition disabled:opacity-50"
              >
                {loading ? (isLogin ? 'Entrando...' : 'Criando conta...') : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <div className="text-center mt-4">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Esqueceu a senha?</a>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-400 text-xs">ou</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50"
            >
              Continuar com Google
            </button>
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              {isLogin ? "Cadastre-se" : "Entrar"}
            </button>
          </span>
        </div>

        {/* Botão de Apoio */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition shadow-md text-sm font-medium"
          >
            Apoiar o Criador
          </button>
        </div>
      </div>

      {/* Modal de Apoio */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl transform transition-all scale-100">

            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">
                Apoiar este projeto
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">

              {/* Valores Sugeridos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Valores sugeridos:</label>
                <div className="grid grid-cols-3 gap-3">
                  {['5', '10', '20'].map((valor) => (
                    <button
                      key={valor}
                      onClick={() => setValor(valor)}
                      className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                        valorPersonalizado === valor
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
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
                  Valor personalizado ☕:
                </label>
                <input
                  type="number"
                  id="valorPersonalizado"
                  value={valorPersonalizado}
                  onChange={(e) => setValorPersonalizado(e.target.value)}
                  placeholder="Digite o valor"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Chave PIX */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Chave PIX:</div>
                <div className="text-sm text-gray-900 font-mono break-all bg-white p-3 rounded-lg border border-gray-300">
                  {pixKey}
                </div>
              </div>

              <div>
                <button
                  onClick={copyPixKey}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Copiar PIX
                </button>
              </div>

            </div>

            {/* Footer do Modal */}
            <div className="p-6 bg-gray-50 rounded-b-3xl">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
