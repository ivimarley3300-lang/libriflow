import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, BookOpen, Loader2, X, Star } from 'lucide-react';

// 1. Definição do "Contrato" do Livro (TypeScript)
interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  rating: string;
  bestseller: boolean;
  image: string;
  desc: string;
}

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Book[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 2. Busca Dinâmica de 200+ Livros no Archive.org
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://archive.org/advancedsearch.php?q=mediatype:texts+AND+subject:fiction+AND+has_itunes_artwork:true&rows=200&output=json"
        );
        const data = await response.json();
        
        const formatted = data.response.docs.map((doc: any, index: number) => ({
          id: doc.identifier,
          title: doc.title || "Título Indisponível",
          author: doc.creator ? (Array.isArray(doc.creator) ? doc.creator[0] : doc.creator) : "Autor Desconhecido",
          price: Math.floor(Math.random() * 70 + 25) + 0.90,
          category: index % 2 === 0 ? "Ficção" : "Clássicos",
          rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          bestseller: index < 15,
          image: `https://archive.org/services/img/${doc.identifier}`,
          desc: "Uma obra clássica preservada no acervo digital da humanidade."
        }));

        setBooks(formatted);
      } catch (error) {
        console.error("Erro na API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E44]">
      
      {/* NAVBAR GLASSMORPHISM */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-[#1A2E44]/90 border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <BookOpen className="text-[#D4AF37]" /> LibriFlow
        </div>
        
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-1/3">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar em 200 livros..." 
            className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-white/10 rounded-full transition-all">
          <ShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#1A2E44] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </nav>

      {/* HEADER HERO */}
      <header className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-black mb-6 tracking-tight text-[#1A2E44]">Sua próxima história começa aqui.</h1>
        <p className="text-lg text-gray-500 leading-relaxed">Explore nossa biblioteca digital com mais de 200 títulos clássicos curados diretamente do Archive.org.</p>
      </header>

      {/* GRID DE LIVROS */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#D4AF37]">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-gray-400 font-medium">Organizando estantes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {filteredBooks.map(book => (
              <div key={book.id} className="group cursor-pointer" onClick={() => setSelectedBook(book)}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={book.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full bg-white text-[#1A2E44] py-2 rounded-lg font-bold text-xs">Ver Detalhes</button>
                  </div>
                </div>
                <h3 className="mt-4 font-bold text-sm line-clamp-1">{book.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{book.author}</p>
                <p className="font-bold text-[#D4AF37]">R$ {book.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* RODAPÉ SIMPLES */}
      <footer className="border-t border-gray-200 py-12 text-center text-sm text-gray-400">
        © 2026 LibriFlow - Powered by Archive.org API
      </footer>

      {/* Aqui entrariam os componentes de Modal e Carrinho (iguais ao anterior, mas com Tipagem) */}
    </div>
  );
}