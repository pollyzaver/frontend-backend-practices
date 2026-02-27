import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-card__badge">Хит</div>
      <img 
        src="/images/the beatles.jpg" 
        alt={product.title}
        className="product-card__image"
      />
      <h3 className="product-card__title">{product.title}</h3>
      <div className="product-card__category">{product.category}</div>
      <p className="product-card__description">{product.description}</p>
      <div className="product-card__price">{product.price} ₽</div>
      <div className="product-card__stock">В наличии: {product.stock} шт.</div>
      <div className="product-card__actions">
        <button onClick={() => onEdit(product)}>Редактировать</button>
        <button onClick={() => onDelete(product.id)}>Удалить</button>
      </div>
    </div>
  );
}