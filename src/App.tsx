import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { HomePage } from "@/pages/public/HomePage"
import { NoticiasPage } from "@/pages/public/NoticiasPage"
import { ParoquiasPage } from "@/pages/public/ParoquiasPage"
import { CleroPage } from "@/pages/public/CleroPage"
import { Footer } from "./components/Footer"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AdminNewsPage } from "./pages/admin/AdminNewsPage"
import { LoginPage } from "./pages/LoginPage"
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage"
import { AdminParoquiasPage } from "./pages/admin/AdminParoquiasPage"
import { AdminCleroPage } from "./pages/admin/AdminCleroPage"
import { InstitucionalPage } from "./pages/public/InstitucionalPage"
import { AdminInstitucionalPage } from "./pages/admin/AdminInstitucionalPage"
import { AdminCongregacaoPage } from "./pages/admin/AdminCongregacaoPage"
import { ReligiosasPage } from "./pages/public/ReligiosasPage"
import { AgendaPage } from "./pages/public/AgendaPage"
import { AdminAgendaPage } from "./pages/admin/AdminAgendaPage"
import { AdminReligiosasPage } from "./pages/admin/AdminReligiosasPage"
import { AdminPalavraPastorPage } from "./pages/admin/AdminPalavraPastorPage"
import { PalavraPastorPage } from "./pages/public/PalavraPastorPage"
import { NoticiaDetailPage } from "./pages/public/NoticiaDetailPage"
import { CleroDetailPage } from "./pages/public/CleroDetailPage"
import { ParoquiaDetailPage } from "./pages/public/ParoquiaDetailPage"
import { CongregacaoDetailPage } from "./pages/public/CongregacaoDetailPage"
import { ReligiosaDetailPage } from "./pages/public/ReligiosaDetailPage"
import { AdminBannersPage } from "./pages/admin/AdminBannersPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors flex flex-col justify-between">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex-1">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/agenda" element={<AgendaPage />} />

            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/noticias/:slug" element={<NoticiaDetailPage />} />

            <Route path="/paroquias" element={<ParoquiasPage />} />
            <Route path="/paroquias/:slug" element={<ParoquiaDetailPage />} />

            <Route path="/clero" element={<CleroPage />} />
            <Route path="/clero/:id" element={<CleroDetailPage />} />

            <Route path="/religiosas" element={<ReligiosasPage />} />
            <Route path="/religiosas/:id" element={<ReligiosaDetailPage />} />
            <Route path="/congregacoes/:id" element={<CongregacaoDetailPage />} />

            <Route path="/a-diocese" element={<InstitucionalPage />} />
            <Route path="/palavra-do-pastor" element={<PalavraPastorPage />} />

            {/* Rotas Protegidas (Admin) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/noticias" element={<ProtectedRoute><AdminNewsPage /></ProtectedRoute>} />
            <Route path="/admin/editar/:id" element={<ProtectedRoute><AdminNewsPage /></ProtectedRoute>} />
            <Route path="/admin/agenda" element={<ProtectedRoute><AdminAgendaPage /></ProtectedRoute>} />
            <Route path="/admin/paroquias" element={<ProtectedRoute><AdminParoquiasPage /></ProtectedRoute>} />
            <Route path="/admin/clero" element={<ProtectedRoute><AdminCleroPage /></ProtectedRoute>} />
            <Route path="/admin/congregacao" element={<ProtectedRoute><AdminCongregacaoPage /></ProtectedRoute>} />
            <Route path="/admin/religiosas" element={<ProtectedRoute><AdminReligiosasPage /></ProtectedRoute>} />
            <Route path="/admin/institucional" element={<ProtectedRoute><AdminInstitucionalPage /></ProtectedRoute>} />
            <Route path="/admin/palavra-do-pastor" element={<ProtectedRoute><AdminPalavraPastorPage /></ProtectedRoute>} />
            <Route path="/admin/banners" element={<AdminBannersPage />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App