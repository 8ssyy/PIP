import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sistema de Gestión de Fusibles NH</CardTitle>
          <CardDescription>Inicie sesión para acceder al sistema de gestión de fusibles</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center">
            <Link href="/diagramas">
              <Button variant="link">Ver diagramas sin iniciar sesión</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

