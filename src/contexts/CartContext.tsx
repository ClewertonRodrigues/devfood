import { useState, createContext, ReactNode, useEffect, useRef, useContext } from "react";
import { FoodProps, ImageFoodProps, ProductsContext } from "./ProductsContext";
import { AuthContext } from "./AuthContext";

import toast from "react-hot-toast";

interface CartProviderProps {
    children: ReactNode;
}

type CartContextData = {
    cart: CartProps[];
    addFoodCart: (food: FoodProps) => void;
    increaseAmount: (id: string) => void
    decreaseAmount: (id: string) => void;
    removeItemCart: (id: string) => void;
    handleFinishPedido: (cart: CartProps[]) => void;
    handleFormatedCurrency: (value: number) => string;
    total: number;
    totalAmount: number;
    subtotalCart: number;
    deliveryFee: number;
}

interface CartProps{
    id: string;
    image: ImageFoodProps;
    name: string;
    category: string;
    description: string;
    price: number;
    subtotal: number;
    amount: number;
}

export const CartContext = createContext({} as CartContextData)

function CartProvider({ children }: CartProviderProps){
    const firstRender = useRef(true)
    const [cart, setCart] = useState<CartProps[]>([])
    const [subtotalCart, setSubtotalCart] = useState(0)
    const [total, setTotal] = useState(0)
    const totalAmount = cart.reduce((acc, obj) => {return acc + obj.amount}, 0)
    const deliveryFee: number = 5;

    const { user } = useContext(AuthContext)
    const { foods } = useContext(ProductsContext)

    useEffect(() => {
        const storageCart = localStorage.getItem("@cart")

        if(storageCart){
            const parsed: CartProps[] = JSON.parse(storageCart)
            
            setCart(parsed)
            totalResultCart(parsed)
        }
    }, [])

    useEffect(() => {

        if(firstRender.current){
            firstRender.current = false
            return;
        }

        localStorage.setItem("@cart", JSON.stringify(cart))
    }, [cart])

    useEffect(() => {

        if(!foods.length || !cart.length) return;
        
        const unavailableId = new Set(
            foods.filter(item => item.status === false)
            .map(item => item.id)
        )
        
        const cartValid = cart.filter(item => !unavailableId.has(item.id))

        if(cartValid.length !== cart.length){
            setCart(cartValid)
            totalResultCart(cartValid)
            localStorage.setItem("@cart", JSON.stringify(cartValid))
        }
        
    }, [foods])

    function addFoodCart(newItem: FoodProps){

        const indexItem = cart.findIndex(item => item.id === newItem.id)
        
        const priceNumber = Number(newItem.price)

        if(indexItem !== -1){
            increaseAmount(newItem.id)
            return;
        }

        let data = {
            id: newItem.id,
            name: newItem.name,
            description: newItem.description,
            category: newItem.category,
            image: newItem.image,
            price: priceNumber,
            amount: 1,
            subtotal: priceNumber
        }

        toast.success("Item adicionado!")
        setCart((item) => [...item, data])
        totalResultCart([...cart, data])
    }

    function increaseAmount(id: string){
        const indexItem = cart.findIndex(itemCart => itemCart.id === id)
        if(indexItem !== -1){

            let cartList = [...cart];

            cartList[indexItem].amount += 1;
            cartList[indexItem].subtotal = cartList[indexItem].amount * cartList[indexItem].price

            setCart(cartList)
            totalResultCart(cartList)
        }
    }

    function decreaseAmount(id: string){
        const indexItem = cart.findIndex(itemCart => itemCart.id === id)
        if(cart[indexItem].amount > 1){

            let cartList = [...cart]

            cartList[indexItem].amount = cartList[indexItem].amount - 1;
            cartList[indexItem].subtotal = cartList[indexItem].price * cartList[indexItem].amount;

            setCart(cartList)
            totalResultCart(cartList)
            return;
        }
        removeItemCart(id)
    }

    function removeItemCart(id: string){
        const removeItem = cart.filter(itemCart => itemCart.id != id)
        setCart(removeItem)
        totalResultCart(removeItem)
    }

    function totalResultCart(items: CartProps[]){
        let myCart = items;
        let result = myCart.reduce((acc, obj) => {return acc + obj.subtotal}, 0)
        setSubtotalCart(result)

        let resultTotal = result + deliveryFee;

        setTotal(resultTotal)
    }

    function handleFormatedCurrency(value: number){
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function handleFinishPedido(cart: CartProps[]){
        
        const phone = "009999999";

        let message = `🍔 *Pedido - Dev Food*\n\n`;

        message += `👤 *Cliente:* ${user?.name}\n\n`;

        message += `📋 *Itens do Pedido*\n\n`;

        cart.forEach(item => {
  message +=
`🍟 *${item.name}*
• Quantidade: ${item.amount}
• Valor unitário: ${handleFormatedCurrency(item.price)}
• Subtotal: ${handleFormatedCurrency(item.subtotal)}

`;
});

message +=
`━━━━━━━━━━━━━━━━━━

💰 *Resumo do Pedido*

Subtotal: ${handleFormatedCurrency(subtotalCart)}
Taxa de entrega: ${handleFormatedCurrency(deliveryFee)}
*Total: ${handleFormatedCurrency(total)}*
`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");

    }

    return(
        <CartContext.Provider value={{
            cart,
            total,
            totalAmount,
            subtotalCart,
            deliveryFee,
            addFoodCart,
            increaseAmount,
            decreaseAmount,
            removeItemCart,
            handleFinishPedido,
            handleFormatedCurrency,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;