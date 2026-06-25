import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Link } from "react-router";

import { motion } from "motion/react"

import { FiTrash2 } from "react-icons/fi";

export function Cart() {
  const {
    cart,
    total,
    totalAmount,
    subtotalCart,
    deliveryFee,
    increaseAmount,
    decreaseAmount,
    removeItemCart,
    handleFinishPedido,
    handleFormatedCurrency,
  } = useContext(CartContext);

  return (
    <div className="bg-[#f8f8f8] w-full min-h-screen">
      <section className="pt-25 pb-5 max-w-6xl w-full mx-auto px-3">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold">Meu carrinho</h2>
          <p className="mt-1 md:mt-2 text-sm text-gray-700">
            Finalizar pedido
          </p>
        </div>

        {cart.length === 0 && (
          <div
            className="w-full flex items-center justify-center flex-col mt-10"
            data-aos="fade-down"
          >
            <p className="text-[#FA2828]/80 lg:text-xl">
              Nenhum item no carrinho!
            </p>
            <Link
              className="mt-2 rounded-md bg-[#FA2828] text-white py-2 px-5 transition-colors duration-300 hover:bg-[#C21F1F]"
              to="/menu"
            >
              Adicionar itens
            </Link>
          </div>
        )}

        <main className="mt-5 flex flex-col lg:flex-row gap-5 overflow-hidden">
          <motion.section 
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut"}}
          >
            {cart.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-md shadow-md p-4 mb-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5">
                    <img
                      className={`rounded-md w-full h-48 md:w-24 md:h-24 ${item.category === "bebida" ? "object-contain" : "object-cover"}`}
                      src={item.image.url}
                      alt=""
                    />

                    <div>
                      <p className="font-bold text-xl md:text-base first-letter:uppercase">
                        {item.name}
                      </p>
                      <p className="text-sm mb-1 md:mb-3">{item.description}</p>
                      <p className="text-[#FA2828] font-bold text-lg md:text-base">
                        {handleFormatedCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 md:mt-0">
                    <p className="text-sm">Subtotal</p>
                    <p className="font-bold text-2xl md:text-xl">
                      {handleFormatedCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-5">
                  <div className="bg-gray-200 rounded-md items-center flex gap-5 p-1">
                    {item.amount > 1 ? (
                      <button
                      onClick={() => decreaseAmount(item.id)}
                      className="bg-white w-8 h-8 rounded-md text-sm font-bold transition-colors duration-300 hover:bg-[#fafafa] cursor-pointer"
                      type="button"
                    >
                      -
                    </button>
                    ):(
                      <div 
                        className="bg-white w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-colors duration-300 hover:bg-[#fafafa] cursor-pointer" 
                        onClick={() => decreaseAmount(item.id)}
                      >
                        <FiTrash2 size={18} color="#FA2828"/>
                      </div>
                    )}
                    <span className=" font-bold">{item.amount}</span>
                    <button
                      onClick={() => increaseAmount(item.id)}
                      className="bg-[#FA2828] text-white w-8 h-8 rounded-md text-sm font-bold transition-colors duration-300 hover:bg-[#C21F1F] cursor-pointer"
                      type="button"
                    >
                      +
                    </button>
                  </div>

                  <p
                    onClick={() => removeItemCart(item.id)}
                    className="text-[#FA2828]"
                  >
                    Remover
                  </p>
                </div>
              </article>
            ))}
          </motion.section>

          {cart.length > 0 && (
            <motion.section
              className="bg-white w-full lg:max-w-sm h-min p-5 sticky top-20 rounded-md shadow-md"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut"}}
            >
              <div className="text-center">
                <span className="font-bold text-2xl">Resumo do pedido</span>
              </div>

              <div className="flex justify-between mt-10">
                <p className="text-sm">Subtotal:</p>
                <p>{handleFormatedCurrency(subtotalCart)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm">Qtd Itens:</p>
                <p>{totalAmount}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm">Taxa de entrega:</p>
                <p>
                  {handleFormatedCurrency(deliveryFee)}
                </p>
              </div>

              <div className="w-full h-px bg-gray-300 mt-2"></div>

              <div className="flex justify-between mt-5">
                <p className="font-semibold">Total:</p>
                <p className="font-bold text-2xl text-[#FA2828]">
                  {handleFormatedCurrency(total)}
                </p>
              </div>

              <button
                className="bg-[#FA2828] text-white w-full rounded-md h-12 mt-5 transition-colors duration-300 hover:bg-[#C21F1F] cursor-pointer"
                type="button" onClick={() => handleFinishPedido(cart)}
              >
                Finalizar Pedido
              </button>

              <Link
                to="/menu"
                className="bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-300 w-full rounded-md h-12 mt-2"
              >
                Adicionar mais itens
              </Link>
            </motion.section>
          )}
        </main>
      </section>
    </div>
  );
}
