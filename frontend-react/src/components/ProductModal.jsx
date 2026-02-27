import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api';

export default function ProductModal({ open, product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    stock: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        title: '',
        price: '',
        category: '',
        description: '',
        stock: ''
      });
    }
  }, [product]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{product ? 'Редактировать' : 'Создать'} товар</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Название"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          <input
            placeholder="Цена"
            type="number"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            required
          />
          <input
            placeholder="Категория"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            required
          />
          <textarea
            placeholder="Описание"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
          <input
            placeholder="Количество на складе"
            type="number"
            value={formData.stock}
            onChange={e => setFormData({...formData, stock: e.target.value})}
            required
          />
          <div className="modal-actions">
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}