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
import { AdminDashboardPage } from "./pages/AdminDashboardPage"
import { AdminParoquiaForm } from "./pages/AdminParoquiaForm"
import { AdminParoquiasPage } from "./pages/AdminParoquiasPage"
import { AdminCleroPage } from "./pages/AdminCleroPage"
import { AdminCleroForm } from "./pages/AdminCleroForm"
import { CleroDetailPage } from "./pages/CleroDetailPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/noticias/:slug" element={<NoticiaDetailPage />} />
            
            <Route path="/paroquias" element={<ParoquiasPage />} />
            <Route path="/paroquias/:slug" element={<ParoquiaDetailPage />} />
            
            <Route path="/clero" element={<CleroPage />} />
            <Route path="/clero/:id" element={<CleroDetailPage />} />

            {/* Rotas Protegidas (Admin) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/publicar" element={<ProtectedRoute><AdminNewsPage /></ProtectedRoute>} />
            <Route path="/admin/editar/:id" element={<ProtectedRoute><AdminNewsPage /></ProtectedRoute>} />

            <Route path="/admin/paroquias" element={<ProtectedRoute><AdminParoquiasPage /></ProtectedRoute>} />
            <Route path="/admin/paroquias/nova" element={<ProtectedRoute><AdminParoquiaForm /></ProtectedRoute>} />
            <Route path="/admin/paroquias/editar/:id" element={<ProtectedRoute><AdminParoquiaForm /></ProtectedRoute>} />

            <Route path="/admin/clero" element={<ProtectedRoute><AdminCleroPage /></ProtectedRoute>} />
            <Route path="/admin/clero/novo" element={<ProtectedRoute><AdminCleroForm /></ProtectedRoute>} />
            <Route path="/admin/clero/editar/:id" element={<ProtectedRoute><AdminCleroForm /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App