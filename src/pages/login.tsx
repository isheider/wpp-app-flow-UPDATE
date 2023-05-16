import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

import logo from "../assets/logo.png";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);

      if (!email || !password) {
        setLoading(false);
        return null;
      }

      const response = await signIn(email, password);

      if (response && response.token) {
        toast.success("Logado com sucesso! Redirecionando...");
        setTimeout(() => {
          window.location.href = "/flows";
        }, 300);
      } else {
        toast.error(
          "Verifique novamente seus dados de acesso e tente novamente!"
        );
        setLoading(false);
      }

      console.log(response);
    }
  };

  return (
    <div className="w-full h-full">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img className="mb-6 w-[300px]" src={logo} alt="Bot Simples" />

          <h1 className="hidden text-xl font-bold leading-tight tracking-tight mb-4 text-gray-900 md:text-4xl dark:text-white">
            BotSimples
          </h1>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Entrar
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    placeholder="nome@email.com
                      "
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  {loading ? (
                    <Oval
                      height={20}
                      width={20}
                      color="white"
                      wrapperStyle={{}}
                      wrapperClass="mx-auto text-center text-white"
                      visible={true}
                      ariaLabel="oval-loading"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  ) : (
                    "Entrar"
                  )}
                </button>
                <p className="text-sm hidden font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-green-600 hover:underline dark:text-green-500"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
