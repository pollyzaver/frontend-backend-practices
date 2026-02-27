import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../api';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';
import './ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Виниловый магазин</h1>
        <button onClick={() => setModalOpen(true)}>+ Добавить товар</button>
      </header>

      <main>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <ProductList 
            products={products} 
            onEdit={(product) => {
              setEditingProduct(product);
              setModalOpen(true);
            }}
            onDelete={handleDelete} 
          />
        )}
      </main>

      <ProductModal
        open={modalOpen}
        product={editingProduct}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={loadProducts}
      />
    </div>
  );
}