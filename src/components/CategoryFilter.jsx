import React from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Share2, 
  MessageSquare, 
  Search, 
  X 
} from 'lucide-react';

const ICON_MAP = {
  LayoutGrid,
  ShoppingBag,
  Share2,
  MessageSquare,
};

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="category-filter-wrapper">
      {/* Abas de Categorias */}
      <div className="filter-tabs" role="tablist" aria-label="Categorias de links">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || LayoutGrid;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`filter-btn ${isActive ? 'active' : ''}`}
            >
              <IconComponent size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Barra de Pesquisa Rápida */}
      <div className="search-wrapper">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar equipamentos, redes ou contato..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="Pesquisar links e produtos"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="search-clear"
            title="Limpar busca"
            aria-label="Limpar busca"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
