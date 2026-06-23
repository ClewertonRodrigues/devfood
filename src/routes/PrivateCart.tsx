import { ReactNode, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Navigate } from "react-router"

interface PrivateProps{
    children: ReactNode;
}

export function PrivCart({ children }: PrivateProps): any{
    
    const { signed, loadingAuth, isAdmin } = useContext(AuthContext)

    if(loadingAuth){
        return <div></div>
    }

    if(!signed){
        return <Navigate to="/"/>
    }

    if(isAdmin){
        return <Navigate to="/dashboard"/>
    }
    
    return children;
}