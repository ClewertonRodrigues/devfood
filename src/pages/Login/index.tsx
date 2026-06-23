import { useEffect, useState } from "react";
import LogoImg from "../../assets/devfood-logo.png";
import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { motion } from "motion/react";

import { Input } from "../../components/Input";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FiLoader } from "react-icons/fi";

import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  function onSubmit(data: FormData) {
    setLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate("/");
      })
      .catch((error: any) => {
        if (error.code === "auth/invalid-credential") {
          toast.error("Email ou senha inválidos!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="flex overflow-hidden">
      <section className="h-screen md:flex justify-center items-center w-5/12 hidden bg-linear-to-b from-[#8F1D1D] to-[#FA2828]">
        <Link to="/">
          <img src={LogoImg} alt="Logo do devfood" className="w-md" />
        </Link>
      </section>
      <section className="min-h-screen bg-gray-100 flex-1 flex justify-center items-center">
        <motion.div
          className="max-w-2xl w-full text-center p-2"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 40 }}
          exit={{ opacity: 0, y: -40 }}
        >
          <Link to="/">
            <img
              src={LogoImg}
              alt="Logo do devfood"
              className="w-36 bg-[#FA2828] rounded-full mx-auto mb-5 md:hidden"
            />
          </Link>

          <span className="text-4xl md:text-6xl font-semibold">Faça Login</span>
          <p className="text-lg md:text-xl mt-2 mb-10">Acesse sua conta</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mb-2"
          >
            <div>
              <Input
                type="email"
                placeholder="Digite seu email..."
                name="email"
                error={errors.email?.message}
                register={register}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Digite sua senha..."
                name="password"
                error={errors.password?.message}
                register={register}
              />
            </div>

            <button
              className={`transition-all duration-300  h-11 rounded-md ${loading ? "bg-[#e48080] cursor-not-allowed" : "bg-[#FA2828] cursor-pointer hover:bg-[#C21F1F] active:scale-95"}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <p>
                  <FiLoader
                    color="white"
                    size={22}
                    className="animate-spin mx-auto"
                  />
                </p>
              ) : (
                <p className="font-bold text-white">Acessar</p>
              )}
            </button>
          </form>

          <Link
            to="/register"
            className="hover:bg-red-400/40 p-1 rounded-md cursor-pointer transition-colors duration-300"
          >
            Ainda não tem conta? Cadastre-se
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
