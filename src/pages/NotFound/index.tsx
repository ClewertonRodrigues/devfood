
import { Link } from "react-router"

export function NotFound(){
    return(
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white">
            <h1 className="text-4xl font-bold mb-2">Ops!</h1>
            <p className="text-2xl mb-5">Essa página não existe.</p>

            <Link to="/menu" className="bg-[#FA2828] text-white py-2 px-5 rounded-md transition-transform duration-500 hover:scale-105">
                Ir para o cardápio
            </Link>
        </div>
    )
}