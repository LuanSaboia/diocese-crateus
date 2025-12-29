import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { HomePage } from "@/pages/HomePage"
import { NoticiasPage } from "@/pages/NoticiasPage"
import { ParoquiasPage } from "@/pages/ParoquiasPage"
import { CleroPage } from "@/pages/CleroPage"
import { ParoquiaDetailPage } from "./pages/ParoquiaDetailPage"
import { Footer } from "./components/Footer"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AdminNewsPage } from "./pages/AdminNewsPage"
import { LoginPage } from "./pages/LoginPage"
import { NoticiaDetailPage } from "./pages/NoticiasDetailPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/noticias/:slug" element={<NoticiaDetailPage />} />
            <Route path="/paroquias" element={<ParoquiasPage />} />
            <Route path="/paroquias/:slug" element={<ParoquiaDetailPage />} />
            <Route path="/clero" element={<CleroPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas Protegidas (Admin) */}
            <Route
              path="/admin/publicar"
              element={
                <ProtectedRoute>
                  <AdminNewsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App