import { ChangeEvent, useState, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext";
import { ProductsContext } from "../../../contexts/ProductsContext";
import { Input } from "../../../components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from "uuid";

import { storage, db } from "../../../services/firebaseConnection";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { IoCloudUploadOutline } from "react-icons/io5";
import { FiTrash2, FiLoader } from "react-icons/fi";

import toast from "react-hot-toast";
import { motion } from "motion/react";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  price: z
    .string()
    .nonempty("O campo preço é obrigatório")
    .refine((value) => /^\d+([,.]\d{1,2})?$/.test(value), {
      message: "Digite um valor válido",
    }),
  category: z.string().refine((value) => value !== "default", {
    message: "Selecione uma categoria",
  }),
  description: z.string().nonempty("A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  name: string;
  previewUrl: string;
  url: string;
}

type Category =
  | "hamburger"
  | "pizza"
  | "acompanhamento"
  | "bebida"
  | "sobremesa";

const categoryOrder: Record<Category, number> = {
  hamburger: 1,
  pizza: 2,
  acompanhamento: 3,
  bebida: 4,
  sobremesa: 5,
};

export function New() {
  const { user } = useContext(AuthContext);
  const { foods } = useContext(ProductsContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      price: "",
      category: "default",
      description: "",
    },
  });

  const [imageFood, setImageFood] = useState<ImageItemProps | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        toast("Envie uma imagem png ou jpeg", {
          icon: "❗",
        });
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    setLoadingImage(true);

    const uidImage = uuidV4();
    const uploadRef = ref(storage, `images/${uidImage}`);

    uploadBytes(uploadRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imagemItem = {
            name: uidImage,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          };

          setImageFood(imagemItem);
        });
      })
      .catch(() => {
        toast.error("Erro ao cadastrar imagem!");
      })
      .finally(() => {
        setLoadingImage(false);
      });
  }

  async function onSubmit(data: FormData) {
    if (!imageFood) {
      toast("Envia uma imagem desse item", {
        icon: "❗",
      });
      return;
    }

    const cleanImage = (img: ImageItemProps) => {
      const { previewUrl, ...rest } = img;
      return rest;
    };

    if (foodAlreadyExists(data.name)) {
      toast.error("Já existe um item com esse nome!");
      return;
    }

    const priceConverted = Number(data.price.replace(",", "."));
    const selectedCategory = data.category as Category;

    addDoc(collection(db, "foods"), {
      name: data.name,
      price: priceConverted,
      category: data.category,
      orderCategory: categoryOrder[selectedCategory],
      description: data.description,
      status: true,
      image: cleanImage(imageFood),
    })
      .then(() => {
        reset();
        setImageFood(null);
        toast.success("Item cadastrado com sucesso!");
      })
      .catch(() => {
        toast.error("Erro ao cadastrar item!");
      });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setImageFood(null);
    } catch (err) {
      toast.error("Erro ao deletar imagem");
    }
  }

  function handleResetForm() {
    if (imageFood) {
      handleDeleteImage(imageFood);
    }
    reset();
    toast.success("Cancelado com sucesso!");
  }

  function foodAlreadyExists(nameFood: string) {
    const normalizedName = nameFood.trim().toLowerCase();

    return foods.some(
      (food) => food.name.trim().toLowerCase() === normalizedName,
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#f8f8f8]">
      <div className="pt-30 pb-5 md:pt-25 max-w-6xl w-full mx-auto px-3">
        <motion.section
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="text-center  md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">
              Painel Administrativo
            </h2>
            <p className="mt-1 md:mt-2 text-sm text-gray-700">
              Adicione itens ao cardápio
            </p>
          </div>

          <Link
            to="/dashboard"
            className="w-full md:w-auto mt-5 md:mt-0 px-6 py-2 rounded-md text-white transition-colors duration-300 bg-[#FA2828] hover:bg-[#C21F1F]"
          >
            <p className="text-center">Ver itens do cardápio</p>
          </Link>
        </motion.section>

        <motion.section
          className="bg-white rounded-md shadow-md w-full p-5 mt-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <span className="font-bold text-xl">Novo Item</span>

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <p className="mb-1 text-sm">Imagem</p>

              <div>
                {imageFood ? (
                  <div className="relative flex items-center justify-center w-28 md:w-36">
                    <button
                      type="button"
                      title="excluir"
                      className="absolute cursor-pointer transition-transform duration-300 hover:scale-110"
                      onClick={() => handleDeleteImage(imageFood)}
                    >
                      <FiTrash2 color="#fff" size={30} />
                    </button>
                    <img
                      className="w-28 md:w-36 h-28 md:h-36 rounded-md object-cover"
                      src={imageFood.previewUrl}
                      alt=""
                    />
                  </div>
                ) : (
                  <label className="border-2 flex justify-center items-center cursor-pointer border-slate-300 w-28 md:w-36 h-28 md:h-36 rounded-md">
                    {loadingImage ? (
                      <FiLoader
                        size={40}
                        color="gray"
                        className="absolute animate-spin"
                      />
                    ) : (
                      <IoCloudUploadOutline
                        className="hover:scale-110 transition-transform duration-300 cursor-pointer absolute z-20"
                        size={50}
                        color="gray"
                      />
                    )}

                    <div className="cursor-pointer">
                      <input
                        title="uplaod"
                        type="file"
                        accept="image/*"
                        className="opacity-0 cursor-pointer"
                        onChange={handleFile}
                      />
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="w-full">
                <p className="mt-2 mb-1 text-sm">Nome do item</p>
                <Input
                  type="text"
                  placeholder="Ex: Pizza Margherita"
                  name="name"
                  error={errors.name?.message}
                  register={register}
                />
              </div>
              <div className="w-full">
                <p className="mt-2 mb-1 text-sm">Preço (R$)</p>
                <Input
                  type="text"
                  placeholder="0,00"
                  name="price"
                  error={errors.price?.message}
                  register={register}
                />
              </div>
            </div>

            <div>
              <p className="mt-2 mb-1 text-sm">Categoria</p>
              <select
                className="w-full border-2 border-slate-300 outline-[#c0261c] h-11 rounded-md px-2"
                aria-label="category"
                {...register("category")}
                id="category"
              >
                <option className="text-sm" value="default" disabled>
                  Selecione uma opção
                </option>
                <option className="text-sm" value="pizza">
                  Pizza
                </option>
                <option className="text-sm " value="bebida">
                  Bebida
                </option>
                <option className="text-sm" value="hamburger">
                  Hamburger
                </option>
                <option className="text-sm" value="sobremesa">
                  Sobremesa
                </option>
                <option className="text-sm" value="acompanhamento">
                  Acompanhamento
                </option>
              </select>

              {errors.category?.message && (
                <p className="my-1 ml-2 text-sm text-red-500 text-start">
                  {errors.category?.message}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="mb-1 text-sm">Descrição</label>

              <textarea
                className="border-2 border-slate-300 w-full rounded-md p-2 resize-none outline-[#c0261c] mt-1 placeholder:text-gray-300"
                {...register("description")}
                name="description"
                id="description"
                placeholder="Descreva o item..."
              ></textarea>
              {errors.description && (
                <p className="mb-1 text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                className="text-white w-full bg-[#FA2828] h-11 rounded-md font-bold transition-colors duration-300 hover:bg-[#C21F1F] cursor-pointer"
              >
                Concluir
              </button>

              {(isDirty || imageFood) && (
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 transition-colors duration-300 px-5 h-11 rounded-md font-bold cursor-pointer"
                  onClick={() => handleResetForm()}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
