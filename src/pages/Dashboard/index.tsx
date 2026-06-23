import { Link } from "react-router";
import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../../contexts/ProductsContext";

import { Modal } from "./components/Modal";

import { FiTrash2 } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { FoodProps } from "../../contexts/ProductsContext";

import { motion } from "motion/react";

export function Dashboard() {
  const { foods, handleChangeStatus, handleDeleteFood } =
    useContext(ProductsContext);

  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [foodIsDelete, setFoodIsDelete] = useState<FoodProps | null>(null);
  const [foodIsUpdate, setFoodIsUpdate] = useState({
    id: "",
    status: false,
  });

  useEffect(() => {
    if (modalUpdate || modalDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalUpdate, modalDelete]);

  function handleModalDelete(food: FoodProps) {
    setModalDelete(true);
    setFoodIsDelete(food);
  }

  function handleModalUpdate(id: string, status: boolean) {
    setModalUpdate(true);
    setFoodIsUpdate({
      id: id,
      status: status,
    });
  }

  function handleActionModal(action: boolean) {
    if (action && foodIsDelete) {
      handleDeleteFood(foodIsDelete);
      setModalDelete(false);
    } else {
      setModalDelete(false);
    }
    setFoodIsDelete(null);
  }

  function handleActionModalUpdate(action: boolean) {
    if (action) {
      handleChangeStatus(foodIsUpdate.id, foodIsUpdate.status);
      setModalUpdate(false);
    } else {
      setModalUpdate(false);
    }

    setFoodIsUpdate({
      id: "",
      status: false,
    });
  }

  return (
    <main className="w-full min-h-screen absolute bg-[#f8f8f8]">
      {modalUpdate && !modalDelete && (
        <Modal
          titleModal="Atualizar status"
          description="Deseja realmente autalizar o status desse item?"
          onCancel={() => handleActionModalUpdate(false)}
          onConfirm={() => handleActionModalUpdate(true)}
        />
      )}

      {modalDelete && !modalUpdate && (
        <Modal
          titleModal="Deletar item"
          description="Deseja realmente excluir esse item?"
          onCancel={() => handleActionModal(false)}
          onConfirm={() => handleActionModal(true)}
        />
      )}

      <div className="pt-30 pb-5 md:pt-25 max-w-6xl w-full mx-auto px-3">
        <motion.section
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">
              Painel Administrativo
            </h2>
            <p className="mt-1 md:mt-2 text-sm text-gray-700">
              Gerencie os itens do cardápio
            </p>
          </div>

          <Link
            to="/dashboard/new"
            className="w-full md:w-auto mt-5 md:mt-0 px-6 py-2 rounded-md text-white bg-[#FA2828] transition-colors duration-300 hover:bg-[#C21F1F]"
          >
            <p className="text-center">+ Adicionar Item</p>
          </Link>
        </motion.section>

        <motion.section
          className="bg-white rounded-md shadow-md mt-3 pb-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p className="font-bold p-5 border-b border-gray-300">
            Itens do Cardápio ({foods.length})
          </p>

          {foods.length === 0 ? (
            <div>
              <p className="text-center pt-5">Lista vazia!</p>
            </div>
          ) : (
            <div className="w-full hidden md:block border-b border-gray-300 py-2 px-5">
              <div className="flex justify-between">
                <div className="text-slate-800 text-sm">
                  <span className="mr-2 md:mr-7">IMAGEM</span>
                  <span>ITEM</span>
                </div>
                <div className="flex gap-2 md:gap-10 text-slate-800 text-sm">
                  <span>PREÇO</span>
                  <span>CATEGORIA</span>
                  <span>STATUS</span>
                  <span>AÇÕES</span>
                </div>
              </div>
            </div>
          )}

          {foods.map((item) => (
            <article
              className="px-5 mt-3 flex flex-col md:flex-row justify-between"
              key={item.id}
            >
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">
                <img
                  src={item.image.url}
                  className={`rounded-md w-full h-48 md:w-16 md:h-16 ${item.category === "bebida" ? "object-contain" : "object-cover"}`}
                  alt=""
                />

                <ul className="w-full">
                  <li className="font-semibold text-xl first-letter:uppercase md:text-lg">
                    {item.name}
                  </li>
                  <li className="text-sm md:text-xs">{item.description}</li>
                </ul>
              </div>

              <div className="flex flex-col md:flex-row md:items-center  gap-3 md:gap-5 mt-3">
                <p className="font-bold text-lg md:text-sm w-full text-[#FA2828]">
                  {item.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p className="bg-gray-200 text-center rounded-full px-3 md:px-2 py-1 md:py-0.5 text-sm md:text-xs">
                  {item.category}
                </p>

                {item.status ? (
                  <p className="bg-green-200 text-green-900 text-center rounded-full px-3 md:px-2 py-1 md:py-0.5 text-sm md:text-xs transition-discrete duration-500">
                    disponível
                  </p>
                ) : (
                  <p className="bg-orange-200 text-orange-800 text-center rounded-full px-3 md:px-2 py-1 md:py-0.5 text-sm md:text-xs transition-discrete duration-500">
                    indisponível
                  </p>
                )}

                <div className="flex justify-between w-full gap-3">
                  {item.status ? (
                    <button
                      type="button"
                      aria-label="atualizar"
                      className="text-purple-500 bg-purple-100 w-full flex justify-center items-center rounded-md py-2.5 md:p-1 transition-colors hover:bg-purple-200 cursor-pointer"
                      onClick={() => handleModalUpdate(item.id, item.status)}
                    >
                      <FaRegEyeSlash size={20} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="atualizar"
                      className="text-purple-500 bg-purple-100 w-full flex justify-center items-center rounded-md py-2.5 md:p-1 transition-colors hover:bg-purple-200 cursor-pointer"
                      onClick={() => handleModalUpdate(item.id, item.status)}
                    >
                      <FaRegEye size={20} />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="excluír"
                    className="text-red-500 bg-red-100 rounded-md w-full flex justify-center items-center py-2.5 md:p-1 transition-colors hover:bg-red-200 cursor-pointer"
                    onClick={() => handleModalDelete(item)}
                  >
                    <FiTrash2 size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </motion.section>
      </div>
    </main>
  );
}
