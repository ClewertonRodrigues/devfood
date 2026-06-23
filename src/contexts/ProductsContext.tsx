import { ReactNode, createContext, useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "../services/firebaseConnection";
import { ref, deleteObject } from "firebase/storage";

import toast from "react-hot-toast";

interface ProductsProviderProps {
  children: ReactNode;
}

type ProductsContextData = {
  foods: FoodProps[];
  filteredFoods: FoodProps[];
  filtro:
    | "todas"
    | "pizza"
    | "hamburger"
    | "bebida"
    | "sobremesa"
    | "acompanhamento";
  handleChangeStatus: (id: string, status: boolean) => void;
  handleDeleteFood: (food: FoodProps) => void;
  handleFilterFood: (
    category:
      | "todas"
      | "pizza"
      | "hamburger"
      | "bebida"
      | "sobremesa"
      | "acompanhamento",
  ) => void;
  loading: boolean;
};

export interface FoodProps {
  id: string;
  name: string;
  price: number;
  category: string;
  orderCategory: string;
  description: string;
  status: boolean;
  image: ImageFoodProps;
}

export interface ImageFoodProps {
  name: string;
  url: string;
}

export const ProductsContext = createContext({} as ProductsContextData);

function ProductsProvider({ children }: ProductsProviderProps) {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [filtro, setFiltro] = useState<
    "todas" | "pizza" | "hamburger" | "bebida" | "sobremesa" | "acompanhamento"
  >("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foodsRef = collection(db, "foods");
    const queryRef = query(foodsRef, orderBy("orderCategory", "asc"));

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      let listFoods = [] as FoodProps[];

      snapshot.forEach((doc) => {
        if (doc.data().category) {
          listFoods.push({
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            category: doc.data().category,
            orderCategory: doc.data().orderCategory,
            description: doc.data().description,
            status: doc.data().status,
            image: doc.data().image,
          });
        }
      });

      setFoods(listFoods);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleChangeStatus(id: string, status: boolean) {
    const docRef = doc(db, "foods", id);

    try {
      await updateDoc(docRef, {
        status: !status,
      });
      toast.success("status atualizado!");
    } catch (err) {
      toast.error("Erro ao atualizar o status");
    }
  }

  async function handleDeleteFood(food: FoodProps) {
    const itemFood = food;
    const docRef = doc(db, "foods", itemFood.id);
    await deleteDoc(docRef);
    toast.success("Item exculído!");

    handleDeleleImageFood(itemFood);
  }

  async function handleDeleleImageFood(food: FoodProps) {
    const imageFood = food.image.name;

    const imagePath = `images/${imageFood}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setFoods(foods.filter((car) => car.id !== food.id));
    } catch {
      toast.error("Erro ao excluir essa imagem");
    }
  }

  function handleFilterFood(
    category:
      | "todas"
      | "pizza"
      | "hamburger"
      | "bebida"
      | "sobremesa"
      | "acompanhamento",
  ) {
    setFiltro(category);
  }

  const filteredFoods = useMemo(() => {
    if (filtro === "todas") {
      return foods;
    }

    return foods.filter((food) => food.category === filtro);
  }, [foods, filtro]);

  return (
    <ProductsContext.Provider
      value={{
        foods,
        filteredFoods,
        handleChangeStatus,
        handleDeleteFood,
        handleFilterFood,
        filtro,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
