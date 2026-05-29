import { useEffect, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import styles from '../styles/ProductList.module.css';
import { loadProducts } from '../utils/productsStorage';
import { productService } from '../services';
import useAuth from '../hooks/useAuth';

function ProductList({ onAddToCart }) {
  const [productsState, setProductsState] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    let mounted = true;

    // try to load from backend, fallback to local seed
    productService
      .list()
      .then((res) => {
        if (!mounted) return;
        if (Array.isArray(res)) setProductsState(res);
        else if (res && Array.isArray(res.data)) setProductsState(res.data);
        else setProductsState(loadProducts());
      })
      .catch(() => {
        if (!mounted) return;
        setProductsState(loadProducts());
      });

    return () => (mounted = false);
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleAddProduct = async (product) => {
    try {
      const created = await productService.create(product);
      const newItem = Array.isArray(created) ? created[created.length - 1] : created?.data ?? created;
      setProductsState((prev) => [...prev, newItem]);
    } catch (e) {
      // fallback to local
      setProductsState((prev) => {
        const maxId = prev.reduce((acc, item) => Math.max(acc, item.id || 0), 0);
        const nextId = maxId + 1;
        return [
          ...prev,
          {
            ...product,
            id: nextId,
            likes: Number(product.likes) || 0,
            isLiked: Boolean(product.isLiked),
          },
        ];
      });
    }

    handleCloseForm();
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.remove(id);
      setProductsState((prev) => prev.filter((product) => product.id !== id));
    } catch (e) {
      // fallback local
      setProductsState((prev) => prev.filter((product) => product.id !== id));
    }

    if (editingProduct?.id === id) {
      handleCloseForm();
    }
  };

  const handleEditStart = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleEditSubmit = async (updatedProduct) => {
    try {
      const updated = await productService.update(updatedProduct.id, updatedProduct);
      const updatedItem = updated?.data ?? updated;
      setProductsState((prev) => prev.map((p) => (p.id === updatedItem.id ? updatedItem : p)));
    } catch (e) {
      setProductsState((prev) =>
        prev.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product))
      );
    }

    handleCloseForm();
  };

  const handleToggleLike = (id) => {
    setProductsState((prev) => {
      return prev.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const currentLikes = Number(product.likes) || 0;
        const wasLiked = Boolean(product.isLiked);

        return {
          ...product,
          isLiked: !wasLiked,
          likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
        };
      });
    });
  };

  const isAdmin = Boolean(currentUser?.isAdmin || (currentUser?.role && String(currentUser.role).toLowerCase() === 'admin'));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Productos Informáticos</h1>
        <p className={styles.subtitle}>
          Encuentra los mejores productos de tecnología para tu setup
        </p>
      </header>

      {isFormOpen ? (
        <ProductForm
          initialValues={editingProduct}
          isEditing={Boolean(editingProduct)}
          onCancel={handleCloseForm}
          onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
        />
      ) : (
        <>
          <div className={styles.toolbar}>
            {isAdmin ? (
              <button className={styles.btnAdd} type="button" onClick={handleOpenCreate}>
                Agregar producto
              </button>
            ) : null}
          </div>

          <div className={styles.grid}>
            {productsState.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                rating={product.rating}
                stock={product.stock}
                image={product.image}
                description={product.description}
                likes={product.likes}
                isLiked={product.isLiked}
                onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
                onToggleLike={() => handleToggleLike(product.id)}
                onDelete={isAdmin ? () => handleDeleteProduct(product.id) : undefined}
                onEdit={isAdmin ? () => handleEditStart(product) : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;