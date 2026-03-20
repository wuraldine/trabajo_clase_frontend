import { useMemo, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Home from './pages/Home';
import ProductList from './pages/ProductList';

import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const handleNavigate = (page) => {
    setActivePage(page);

    if (page !== 'category') {
      setSelectedCategory(null);
    }
  };

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('category');
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
    setActivePage('home');
  };

  const handleAddToCart = (product) => {
    if (!product?.id) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: Number(product.price) || 0,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateCartItemQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const page = useMemo(() => {
    if (activePage === 'category') {
      return <CategoryProducts category={selectedCategory} onBack={handleBackFromCategory} />;
    }
    if (activePage === 'products') return <ProductList onAddToCart={handleAddToCart} />;
    if (activePage === 'cart') {
      return (
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateCartItemQuantity}
          onClearCart={handleClearCart}
        />
      );
    }

    return <Home onOpenCategory={handleOpenCategory} />;
  }, [activePage, cartItems, selectedCategory]);

  const handleSignIn = () => {
    setUser({ name: 'Usuario' });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="main">{page}</main>

      <Footer />
    </div>
  );
}

export default App;