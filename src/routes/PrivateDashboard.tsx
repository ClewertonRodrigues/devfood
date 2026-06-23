import { ReactNode, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Navigate } from "react-router"

interface PrivateProps{
    children: ReactNode;
}

export function PrivDashboard({ children }: PrivateProps): any{
    const { signed, loadingAuth, isAdmin } = useContext(AuthContext)

    if(loadingAuth){
        return <div></div>
    }

    if(!signed || !isAdmin){
        return <Navigate to="/"/>
    }

    return children;
}