import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ProductsContext } from "../../contexts/ProductsContext";
import { CartContext } from "../../contexts/CartContext";
import { FilterButton } from "./components/FilterButton";
import { Link } from "react-router";

import { FiLoader } from "react-icons/fi";

import { AnimatePresence, motion } from "motion/react";

export function Menu() {
  useEffect(() => {
    handleFilterFood("todas");
  }, []);

  const { signed, isAdmin } = useContext(AuthContext);
  const { filteredFoods, filtro, handleFilterFood, loading } =
    useContext(ProductsContext);
  const { addFoodCart } = useContext(CartContext);

  const activeFoods = filteredFoods.filter(item => item.status === true);

  return (
    <main className="bg-[#f8f8f8] min-h-screen w-full flex justify-center ">
      <div className="pt-25 w-full max-w-6xl">
        <section className="text-center" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold">Nosso Cardápio</h2>
          <p className="mt-2 text-sm text-gray-700">
            Escolha suas delícias favoritas
          </p>
        </section>

        <section className="gap-3 mt-5 md:mt-10 w-full max-5xl flex justify-center px-3 flex-wrap">
          <FilterButton
            nameFilter="Todas"
            onClick={() => handleFilterFood("todas")}
            active={filtro === "todas"}
          />
          <FilterButton
            nameFilter="Hambúrgeres"
            onClick={() => handleFilterFood("hamburger")}
            active={filtro === "hamburger"}
          />
          <FilterButton
            nameFilter="Pizzas"
            onClick={() => handleFilterFood("pizza")}
            active={filtro === "pizza"}
          />
          <FilterButton
            nameFilter="Acompanhamentos"
            onClick={() => handleFilterFood("acompanhamento")}
            active={filtro === "acompanhamento"}
          />
          <FilterButton
            nameFilter="Bebidas"
            onClick={() => handleFilterFood("bebida")}
            active={filtro === "bebida"}
          />
          <FilterButton
            nameFilter="Sobremesas"
            onClick={() => handleFilterFood("sobremesa")}
            active={filtro === "sobremesa"}
          />
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={filtro}
            initial={{ opacity: 0.96 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.96 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-10 gap-3 px-3 pb-5"
          >
            {activeFoods
              .map((item) => (
                <motion.article
                  key={item.id}
                  className="bg-white shadow-md rounded-md overflow-hidden min-h-[300px] flex flex-col group"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <div className="overflow-hidden w-full h-56">
                    <img
                      src={item.image.url}
                      className={`w-full h-56 transition-all duration-300 group-hover:scale-107 ${item.category === "bebida" ? "object-contain" : "object-cover"}`}
                      alt={item.name}
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <span className="font-bold text-lg lg:text-base first-letter:uppercase">
                      {item.name}
                    </span>
                    <p className="text-sm mb-5 mt-0.5">{item.description}</p>

                    <div className="mt-auto flex justify-between">
                      <span className="font-bold text-lg text-[#FA2828]">
                        {item.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      {signed && !isAdmin && (
                        <button
                          onClick={() => addFoodCart(item)}
                          className="bg-[#FA2828] text-white px-6 rounded-md text-lg transition-all duration-300 hover:bg-[#C21F1F] cursor-pointer active:scale-95"
                          type="button"
                        >
                          +
                        </button>
                      )}

                      {!signed && (
                        <Link
                          className="bg-[#FA2828] text-white px-6 rounded-md text-lg transition-colors duration-300 hover:bg-[#C21F1F] cursor-pointer"
                          to="/login"
                        >
                          +
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
          </motion.section>
        </AnimatePresence>

        {activeFoods.length === 0 &&
          loading && (
            <p className="w-full">
              <FiLoader
                size={50}
                color="#FA2828"
                className="mx-auto animate-spin"
              />
            </p>
          )}

        {activeFoods.length === 0 &&
          !loading && (
            <p className="text-center text-xl md:text-2xl text-red-400">
              Sem itens no momento!
            </p>
          )}
      </div>
    </main>
  );
}
