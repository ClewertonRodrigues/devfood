import { useState } from "react";
import { Link } from "react-router";

import { CardInfo } from "./components/CardInfo";

import { IoIosArrowForward } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

export function Home() {
  const [animation, setAnimation] = useState<boolean>(false);

  return (
    <div>
      <section className="bg-linear-to-b from-[#8F1D1D] to-[#FA2828] flex justify-center flex-col items-center w-full py-50 relative">
        <div
          className="text-white max-w-2xl w-full flex flex-col gap-3 justify-center items-center"
          data-aos="fade-down"
        >
          <h1 className="text-6xl text-center font-bold">
            Sabor que <span className="text-amber-400">Conquista</span>
          </h1>

          <p className="md:text-lg mt-2 px-3 text-center text-slate-100">
            As melhores pizzas, hambúrgeres e sobremesas da cidade. Delivery
            rápido e qualidade garantida!
          </p>

          <Link
            to="/menu"
            className="bg-white flex items-center gap-2 my-3 text-[#FA2828] font-bold rounded-full px-8 py-3 transition-transform hover:scale-105"
            onMouseEnter={() => setAnimation(!animation)}
            onMouseOut={() => setAnimation(!animation)}
          >
            Ver Cardápio
            <IoIosArrowForward
              className={`${animation ? "translate-x-4" : ""} transition-transform duration-500`}
              size={20}
            />
          </Link>
        </div>

        <div className="absolute w-full bottom-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-25 lg:h-30"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,120 360,0 720,20 C1080,40 1200,120 1440,80 L1440 120 L0 120 Z"
              fill="#f8f8f8"
            ></path>
          </svg>
        </div>
      </section>
      <section className="w-full bg-[#f8f8f8] py-12">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold">
            Por Que Nosso Sabor Conquista?
          </h2>
          <p className="mt-2 text-md text-gray-700">
            Compromisso com qualidade e satisfação
          </p>
        </div>

        <div className="grid md:grid-cols-3 w-full max-w-6xl gap-5 mx-auto px-3 mt-10">
          <CardInfo
            icon={<FiClock color="#FA2828" size={27} />}
            bgIcon="bg-[#fad7d7]"
            title="Entrega Rápida"
            description="Seu pedido chega quentinho em até 30 minutos. Garantimos agilidade sem perder a qualidade!"
          />
          <CardInfo
            icon={<IoLocationOutline color="#fa851b" size={27} />}
            bgIcon="bg-[#fce1c0]"
            title="Cobertura Ampla"
            description="Atendemos toda a região com excelência. Onde quer que você esteja, levamos sabor até você!"
          />
          <CardInfo
            icon={<FaStar color="#99721c" size={24} />}
            bgIcon="bg-[#fcfcd2]"
            title="Qualidade Premium"
            description="Ingredientes frescos e selecionados. Cada prato é preparado com carinho e dedicação!"
          />
        </div>
      </section>
      <section className="w-full bg-linear-to-t from-[#8F1D1D] to-[#FA2828] py-12 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Está Com Fome?
        </h2>
        <p className="text-white mt-2">
          Faça seu pedido agora e receba em casa!
        </p>
        <Link
          to="/menu"
          className="bg-white flex items-center gap-2 mt-5 text-[#DE2626] font-bold rounded-full px-8 py-3 transition-transform hover:scale-105"
        >
          Explorar Cardápio
          <IoIosArrowForward size={20} />
        </Link>
      </section>
    </div>
  );
}
